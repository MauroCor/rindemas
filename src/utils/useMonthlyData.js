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

export const focusCurrentMonth = (dataMonths, setStartIndex, itemsPerPage = 3) => {
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
    const total = dataMonths.length;
    const half = Math.floor(itemsPerPage / 2);
    let start = currentIndex !== -1 ? currentIndex - half : 0;
    start = Math.max(0, start);
    start = Math.min(start, Math.max(0, total - itemsPerPage));
    setStartIndex(start);
}; 