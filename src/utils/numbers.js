export const formatNumber = (num) => {
    if (num >= 1000 || num <= -1000) {
        return `$${Math.round(num / 1000)}k`;
    } else {
        return `$${Math.round(num)}`;
    }
};

export const formatPrice = (num, ccy) => {
    const isARS = ccy === 'ARS';
    const currencySymbol = isARS ? '$' : 'u$d';
    const formattedValue = Math.abs(num) >= 1000 ? `${Math.round(num / 1000)}k` : `${Math.round(num)}`;

    return (
        <>
            <span className="text-[10px] align-top">{currencySymbol}</span> {formattedValue}
        </>
    );
};

export const subtractMonths = (date, months) => {
    const [year, month] = date.split('-').map(Number);
    const result = new Date(year, month - 1);
    result.setMonth(result.getMonth() - months);
    return result.toISOString().slice(0, 7);
};
