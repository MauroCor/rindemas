export const formatNumber = (num) => {
    if (num >= 1000) {
        return `$${(num / 1000).toFixed(0)}k`;
    }
    return `$${num}`;
};