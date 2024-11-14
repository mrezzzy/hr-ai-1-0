export const HH_CONFIG = {
  API_URL: 'https://api.hh.ru',
  CLIENT_ID: process.env.HH_CLIENT_ID,
  CLIENT_SECRET: process.env.HH_CLIENT_SECRET,
  REDIRECT_URI: process.env.HH_REDIRECT_URI,
  USER_AGENT: 'AI-HR-App/1.0 (ai-hr.ru)',
  AREAS: {
    MOSCOW: '1',
    SAINT_PETERSBURG: '2',
    EKATERINBURG: '3'
  },
  EXPERIENCE: {
    NO_EXPERIENCE: 'noExperience',
    BETWEEN_1_AND_3: 'between1And3',
    BETWEEN_3_AND_6: 'between3And6',
    MORE_THAN_6: 'moreThan6'
  },
  EMPLOYMENT: {
    FULL: 'full',
    PART: 'part',
    PROJECT: 'project',
    VOLUNTEER: 'volunteer',
    PROBATION: 'probation'
  },
  SCHEDULE: {
    FULLDAY: 'fullDay',
    SHIFT: 'shift',
    FLEXIBLE: 'flexible',
    REMOTE: 'remote',
    FLY_IN_FLY_OUT: 'flyInFlyOut'
  }
};

// Validate required environment variables
const requiredEnvVars = {
  HH_CLIENT_ID: process.env.HH_CLIENT_ID,
  HH_CLIENT_SECRET: process.env.HH_CLIENT_SECRET,
  HH_REDIRECT_URI: process.env.HH_REDIRECT_URI,
  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN
};

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    console.error(`Environment variable ${key} is missing. Available env vars:`, process.env);
    throw new Error(`Missing required environment variable: ${key}. Please check your .env file and Docker configuration.`);
  }
});