export const getMonthName = (dateStr) => {
  const month = parseInt(dateStr.split('-')[1], 10) - 1;
  const monthName = new Date(2024, month).toLocaleString('es-ES', { month: 'long' });
  return monthName.charAt(0).toUpperCase() + monthName.slice(1);
};

export const isCurrentYearMonth = (ym) => {
  const current = new Date().toISOString().slice(0, 7);
  return ym === current;
};
