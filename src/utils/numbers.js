export const formatNumber = (num) => {
    const absNum = Math.abs(num);
    
    if (absNum >= 1000000) {
        const millions = num / 1000000;
        return `$${millions % 1 === 0 ? Math.round(millions) : millions.toFixed(1)}M`;
    } else if (absNum >= 1000) {
        return `$${Math.round(num / 1000)}k`;
    } else {
        return `$${Math.round(num)}`;
    }
};

export const formatPrice = (num, ccy) => {
    const isARS = ccy === 'ARS';
    const currencySymbol = isARS ? '$' : 'u$d';
    
    let formattedValue;
    const absNum = Math.abs(num);
    
    if (isARS) {
        if (absNum >= 1000000) {
            const millions = num / 1000000;
            formattedValue = millions % 1 === 0 ? Math.round(millions) : millions.toFixed(1);
            formattedValue += 'M';
        } else if (absNum >= 1000) {
            formattedValue = `${Math.round(num / 1000)}k`;
        } else {
            formattedValue = `${Math.round(num)}`;
        }
    } else {
        formattedValue = `${Math.round(num)}`;
    }

    return (
        <>
            <span className="text-[10px] align-top">{currencySymbol}</span> {formattedValue}
        </>
    );
};

export const adjustMonths = (date, months) => {
    const [year, month] = date.split('-').map(Number);
    const result = new Date(year, month - 1);
    result.setMonth(result.getMonth() + months);
    return result.toISOString().slice(0, 7);
  };

// Convierte una tasa anual efectiva (por ejemplo 60 => 60%) a tasa mensual equivalente en decimal (0.041...)
export const annualToMonthly = (annualPercent) => {
    const annual = Number(annualPercent) / 100;
    if (!isFinite(annual) || annual <= -1) return 0;
    const monthly = Math.pow(1 + annual, 1 / 12) - 1;
    return monthly;
};

// Construye el índice de precios acumulado (CPI) a partir de una serie de inflaciones mensuales en decimal
// Devuelve un array del mismo largo con el índice acumulado empezando en 1
export const cumulativeIndex = (monthlyInflations) => {
    const result = [];
    let acc = 1;
    for (let i = 0; i < monthlyInflations.length; i++) {
        const pi = Number(monthlyInflations[i]) || 0;
        acc *= (1 + pi);
        result.push(acc);
    }
    return result;
};
