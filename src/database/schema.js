import knex from 'knex';
import { config } from '../config/database.js';
import logger from '../config/logger.js';

const db = knex(config);

export async function createTables() {
  try {
    // Create resume_contacts table if not exists
    const contactsExists = await db.schema.hasTable('resume_contacts');
    if (!contactsExists) {
      await db.schema.createTable('resume_contacts', table => {
        table.string('resume_id').primary();
        table.string('full_name');
        table.json('phones');
        table.string('email');
        table.string('preferred_contact');
        table.timestamps(true, true);
      });
      logger.info('Created resume_contacts table');
    }

    // Create resumes table if not exists
    const resumesExists = await db.schema.hasTable('resumes');
    if (!resumesExists) {
      await db.schema.createTable('resumes', table => {
        table.string('id').primary();
        table.string('title');
        table.string('first_name');
        table.string('last_name');
        table.string('middle_name');
        table.integer('age');
        table.string('gender');
        table.string('area');
        table.string('metro');
        table.decimal('salary_amount');
        table.string('salary_currency');
        table.string('experience_total');
        table.string('education_level');
        table.text('skills');
        table.json('languages');
        table.json('citizenship');
        table.json('work_ticket');
        table.json('driver_license');
        table.string('photo_url');
        table.json('portfolio');
        table.string('job_search_status');
        table.string('alternate_url');
        table.boolean('has_vehicle');
        table.json('relocation');
        table.string('business_trip_readiness');
        table.timestamps(true, true);
      });
      logger.info('Created resumes table');
    }
  } catch (error) {
    logger.error('Error creating tables:', error);
    throw error;
  }
}

export async function dropTables() {
  try {
    await db.schema.dropTableIfExists('resume_contacts');
    await db.schema.dropTableIfExists('resumes');
    logger.info('Dropped all tables');
  } catch (error) {
    logger.error('Error dropping tables:', error);
    throw error;
  }
}

export default db;