import { parse, isSameMonth } from 'date-fns';


export const getMonthlyData = (data, startIndex, itemsPerPage) => {
    return data.slice(startIndex, startIndex + itemsPerPage);
};

export const handlePrev = (currentIndex, itemsPerPage) => {
    return Math.max(currentIndex - itemsPerPage, 0);
};

export const handleNext = (currentIndex, itemsPerPage, totalItems) => {
    return Math.min(currentIndex + itemsPerPage, totalItems - itemsPerPage);
};

export const focusCurrentMonth = (dataMonths, setStartIndex) => {
    const currentDate = new Date();
    let currentIndex = dataMonths.findIndex((month) => {
        const monthDate = parse(month.date, 'yyyy-MM', new Date());
        return isSameMonth(monthDate, currentDate);
    });
    if (currentIndex === -1) {
        for (let i = 0; i < dataMonths.length; i++) {
            const monthDate = parse(dataMonths[i].date, 'yyyy-MM', new Date());
            if (monthDate > currentDate) {
                currentIndex = i;
                break;
            }
        }
    }
    setStartIndex(currentIndex !== -1 ? Math.max(currentIndex - 1, 0) : 0);
}; 