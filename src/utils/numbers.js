export const formatNumber = (num) => {
    if (num >= 1000 || num <= -1000) {
        return `$${Math.round(num / 1000)}k`;
    } else {
        return `$${Math.round(num)}`;
    }
};
