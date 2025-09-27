export const handleApiError = (error, context = '') => {
  console.error(`API Error ${context}:`, error.message);
  
  if (error.message.includes('Network')) {
    alert('Error de conexión. Verifique su internet.');
    return;
  }
  
  alert('Error inesperado. Intente nuevamente.');
};
