import { base_url } from '../services/config';

const isLocal = typeof base_url === 'string' && base_url.includes('localhost');

export const logError = (...args) => {
  if (isLocal) {
    console.error(...args);
  }
};

export const logWarn = (...args) => {
  if (isLocal) {
    console.warn(...args);
  }
};

export const logInfo = (...args) => {
  if (isLocal) {
    console.info(...args);
  }
};

export const logApiError = (...args) => logError(...args);
export const logFetchError = (...args) => logError(...args);
