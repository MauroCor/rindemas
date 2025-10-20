import { logError } from '../utils/logger';

export const handleApiError = (error, context = '') => {
  logError(`API Error ${context}:`, error);
  if (error?.message?.includes('Network')) return 'Error de conexión. Verifique su internet.';
  if (error?.data || error?.status) {
    const d = error.data;
    const m = typeof d === 'string' ? d : Array.isArray(d?.non_field_errors) ? d.non_field_errors[0] : d && typeof d === 'object' ? (() => { const k = Object.keys(d)[0]; const v = d[k]; return Array.isArray(v) ? v[0] : v; })() : '';
    return /already exist between these dates\.?/i.test(String(m || '')) ? String(m).replace(/already exist between these dates\.?/i, 'ya existe entre esas fechas.') : 'Revise los campos ingresados';
  }
  return 'Ocurrió un error al procesar la solicitud.';
};
