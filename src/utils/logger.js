export const logError = (context, error) => {
  console.error(`Error ${context}:`, error);
};

export const logApiError = (context, error) => {
  console.error(`API Error ${context}:`, error);
};

export const logFetchError = (context, error) => {
  console.error(`Error fetching ${context}:`, error);
};
