export const FIXED_COLORS = [
  '#3B82F6', // Azul
  '#16A085', // Verde
  '#F59E0B', // Amarillo
  '#EF4444', // Rojo
  '#8B5CF6', // Púrpura
  '#06B6D4', // Cian
  '#F97316', // Naranja
  '#84CC16', // Lima
  '#EC4899', // Rosa
  '#6B7280', // Gris
  '#16A085', // Teal
  '#F43F5E', // Rose
];

// Generar color consistente basado en el nombre
export const generateColor = (name) => {
  // Usar las primeras letras del nombre para una distribución más uniforme
  const firstChar = name.charCodeAt(0) || 0;
  const secondChar = name.charCodeAt(1) || 0;
  const thirdChar = name.charCodeAt(2) || 0;
  
  // Combinar caracteres para obtener un índice más distribuido
  const combined = (firstChar + secondChar * 2 + thirdChar * 3) % FIXED_COLORS.length;
  return FIXED_COLORS[combined];
};
