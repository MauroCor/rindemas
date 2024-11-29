export const getMonthlyData = (data, startIndex, itemsPerPage) => {
    return data.slice(startIndex, startIndex + itemsPerPage);
  };
  
  export const handlePrev = (currentIndex, itemsPerPage) => {
    return Math.max(currentIndex - itemsPerPage, 0);
  };
  
  export const handleNext = (currentIndex, itemsPerPage, totalItems) => {
    return Math.min(currentIndex + itemsPerPage, totalItems - itemsPerPage);
  };