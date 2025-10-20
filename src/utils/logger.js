import { base_url } from '../services/config';

const isLocal = typeof base_url === 'string' && base_url.includes('localhost');

export const logError = (...args) => {
  if (isLocal) {
    // eslint-disable-next-line no-console
    console.error(...args);
  }
};

export const logWarn = (...args) => {
  if (isLocal) {
    // eslint-disable-next-line no-console
    console.warn(...args);
  }
};

export const logInfo = (...args) => {
  if (isLocal) {
    // eslint-disable-next-line no-console
    console.info(...args);
  }
};

// Compatibilidad con imports existentes
export const logApiError = (...args) => logError(...args);
export const logFetchError = (...args) => logError(...args);
