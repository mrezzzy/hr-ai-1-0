import fetch from 'node-fetch';
import logger from '../config/logger.js';
import { HH_CONFIG } from '../config/constants.js';
import db from '../database/schema.js';

export class ResumesService {
  static async getResumeContacts(resumeId, token) {
    try {
      logger.info(`Fetching contacts for resume ${resumeId}`);

      const response = await fetch(`${HH_CONFIG.API_URL}/resumes/${resumeId}/contacts`, {
        headers: {
          'User-Agent': HH_CONFIG.USER_AGENT,
          'Authorization': `Bearer ${token}`,
          'HH-User-Agent': HH_CONFIG.USER_AGENT
        }
      });

      if (!response.ok) {
        const error = await response.json();
        logger.error('HH API error:', error);
        
        if (response.status === 403) {
          throw new Error('Access denied. Please check your employer account permissions.');
        }
        
        throw new Error(error.description || 'Failed to fetch resume contacts');
      }

      const data = await response.json();
      
      // Transform contacts data
      const contacts = {
        full_name: `${data.last_name || ''} ${data.first_name || ''} ${data.middle_name || ''}`.trim(),
        phones: data.phones?.map(phone => ({
          country: phone.country,
          city: phone.city,
          number: phone.number,
          formatted: phone.formatted
        })) || [],
        email: data.email,
        preferred_contact_method: data.preferred_contact_method?.name
      };

      // Save contacts to database
      await this.saveContactsToDb(resumeId, contacts);

      return contacts;
    } catch (error) {
      logger.error('Error fetching resume contacts:', error);
      throw error;
    }
  }

  static async saveContactsToDb(resumeId, contacts) {
    try {
      await db('resume_contacts')
        .insert({
          resume_id: resumeId,
          full_name: contacts.full_name,
          phones: JSON.stringify(contacts.phones),
          email: contacts.email,
          preferred_contact_method: contacts.preferred_contact_method,
          updated_at: new Date()
        })
        .onConflict('resume_id')
        .merge();

      logger.info(`Contacts for resume ${resumeId} saved to database`);
    } catch (error) {
      logger.error(`Error saving contacts for resume ${resumeId} to database:`, error);
      // Don't throw error to prevent API failure if DB save fails
    }
  }
}