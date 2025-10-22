// Calcular totales con proyección de tipo de cambio
export const calculateTotalsWithProjection = (filteredData, fxPath) => {
  return filteredData.map((item, idx) => {
    const totalARSWithCarry = Number(item.total_ars_with_carry) || 0;
    const totalUSDWithCarry = Number(item.total_usd_with_carry) || 0;
    
    const projectedFx = fxPath[idx] || 0;
    const totalUSDInARS = totalUSDWithCarry * projectedFx;
    
    return totalARSWithCarry + totalUSDInARS;
  });
};

// Calcular totales reales (deflactados)
export const calculateTotalsReal = (filteredData, cpiIndex, usCpiIndex, fxPath) => {
  if (!cpiIndex || cpiIndex.length === 0) return [];
  
  return filteredData.map((item, idx) => {
    const totalARSWithCarry = Number(item.total_ars_with_carry) || 0;
    const totalUSDWithCarry = Number(item.total_usd_with_carry) || 0;

    // ARS reales (deflactado por CPI ARG)
    const arsReal = cpiIndex[idx] ? totalARSWithCarry / cpiIndex[idx] : totalARSWithCarry;
    // USD reales (deflactado por CPI USA) y luego convertido a pesos
    const usdRealUSD = (usCpiIndex && usCpiIndex[idx]) ? (totalUSDWithCarry / usCpiIndex[idx]) : totalUSDWithCarry;
    const usdRealInPesos = usdRealUSD * (fxPath[idx] || 0);

    return arsReal + usdRealInPesos;
  });
};

// Obtener retorno mensual por ahorro según tipo
export const getMonthlyReturnForSaving = (month, saving) => {
  if (saving.type === 'plan') return null;

  if (saving.type === 'fixed') {
    const isMaturity = saving.date_to && month.date && String(saving.date_to) === String(month.date);
    const inv = Number(saving.invested) || 0;
    const obt = Number(saving.obtained) || 0;
    return isMaturity && inv > 0 ? (obt - inv) / inv : 0;
  }

  const tna = saving.tna != null ? Number(saving.tna) : 0;
  if (!tna || tna === null || tna === undefined) return null;
  
  // Para renta variable (var), TNA es rendimiento acumulado vs compra inicial
  if (saving.type === 'var') {
    return month.date === saving.date_from ? 0 : tna;
  } else {
    return month.date === saving.date_from ? 0 : tna / 100 / 12;
  }
};

// Calcular rendimientos mensuales del portafolio
export const calculatePortfolioMonthlyReturns = (filteredData, detailUnit) => {
  const result = new Array(filteredData.length).fill(0);
  
  for (let idx = 0; idx < filteredData.length; idx++) {
    const month = filteredData[idx];
    let weightedSum = 0;
    let weightDen = 0;
    
    month.saving.forEach(s => {
      // Excluir tipo 'plan' en modo Detalle
      if (s.type === 'plan') return;
      
      // Filtrar por divisa según unidad
      if ((detailUnit === 'pesos' && s.ccy !== 'ARS') || (detailUnit === 'dolares' && s.ccy !== 'USD')) return;
      
      const rMonthly = getMonthlyReturnForSaving(month, s);
      if (rMonthly === null) return;
      
      // peso: capital del mes en la divisa del ahorro
      const amount = Number(s.amount) || 0;
      const invested = Number(s.invested) || 0;
      const weight = amount > 0 ? amount : invested;
      
      if (weight > 0) {
        weightedSum += rMonthly * weight;
        weightDen += weight;
      }
    });
    
    result[idx] = weightDen > 0 ? (weightedSum / weightDen) : 0; // %
  }
  
  return result;
};

export const accumulatePct = (rMonthlyPct, detailUnit = null) => {
  const out = [];
  let acc = 1;
  for (let i = 0; i < rMonthlyPct.length; i++) {
    const value = rMonthlyPct[i] || 0;
    
    // Si es modo dólares, mostrar mensual
    if (detailUnit === 'dolares') {
      out.push(value);
    } else {
      // Si es modo pesos, acumular
      const isPercentage = Math.abs(value) > 1;
      acc *= (1 + (isPercentage ? value / 100 : value));
      out.push((acc - 1) * 100);
    }
  }
  return out;
};

// Calcular promedio optimizado
export const calculateAverage = (filteredData, fxPath) => {
  let sum = 0;
  for (let i = 0; i < filteredData.length; i++) {
    const item = filteredData[i];
    const totalARSWithCarry = Number(item.total_ars_with_carry) || 0;
    const totalUSDWithCarry = Number(item.total_usd_with_carry) || 0;
    const fx = fxPath[i] || 0;
    sum += totalARSWithCarry + (totalUSDWithCarry * fx);
  }
  return sum / (filteredData.length || 1);
};

// Generar datasets de ahorros individuales
export const generateDetailSavingsDatasets = (filteredData, labels, detailUnit, generateColor) => {
  const isPesos = detailUnit === 'pesos';
  const perSavingMap = new Map();

  for (let idx = 0; idx < filteredData.length; idx++) {
    const month = filteredData[idx];
    month.saving.forEach((s) => {
      // Excluir tipo 'plan' en modo Detalle
      if (s.type === 'plan') return;
      
      // Filtrar por divisa
      if (isPesos && s.ccy !== 'ARS') return;
      if (!isPesos && s.ccy !== 'USD') return;

      const rMonthly = getMonthlyReturnForSaving(month, s);
      if (rMonthly === null) return;

      const key = `${s.name}::${s.ccy}`;
      if (!perSavingMap.has(key)) {
        perSavingMap.set(key, {
          name: s.name,
          ccy: s.ccy,
          color: generateColor(s.name),
          acc: 1,
          data: Array(labels.length).fill(null),
        });
      }
      
      const entry = perSavingMap.get(key);
      if (s.type === 'var') {
        entry.data[idx] = rMonthly;
      } else {
        entry.acc *= (1 + (rMonthly || 0));
        entry.data[idx] = (entry.acc - 1) * 100;
      }
    });
  }

  return Array.from(perSavingMap.values()).map((s) => ({
    label: `${s.name} (${s.ccy})`,
    data: s.data,
    borderColor: s.color,
    backgroundColor: 'rgba(0,0,0,0)',
    pointRadius: 2,
    borderWidth: 2,
    tension: 0.2,
    fill: false,
  }));
};
