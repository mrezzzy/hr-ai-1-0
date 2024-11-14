import { createTables } from './schema.js';
import logger from '../config/logger.js';

async function migrate() {
  try {
    logger.info('Starting database migration...');
    await createTables();
    logger.info('Database migration completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
}

// Execute migration
migrate();