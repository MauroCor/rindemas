import React, { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { formatNumber, annualToMonthly, cumulativeIndex } from '../utils/numbers';
import { useInflation } from '../context/InflationContext';
import { useExchangeRate } from '../context/ExchangeRateContext';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const GraphComponent = ({ data, showAverage = false, showSavings = false, graphMode, onChangeGraphMode }) => {
  const [startMonth, setStartMonth] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const { buildCpiIndex, annualInflationPercentInput, setAnnualInflationPercentInput } = useInflation();
  const { exchangeRate } = useExchangeRate();
  const [usdAnnualChangeInput, setUsdAnnualChangeInput] = useState('0');
  const [usInflationInput, setUsInflationInput] = useState('3');
  const [detailUnit, setDetailUnit] = useState('pesos');

  const datagraph = data.map((item) => ({
    ...item,
    saving: item.saving.map((saving) => {
      const isLastMonth = item.date === saving.date_to;
      return {
        ...saving,
        amount: (saving.type === 'flex' || saving.type === 'var' || isLastMonth) ? saving.obtained : saving.invested
      };
    }),
  }));

  const filteredData = datagraph.filter((item) => {
    if (!startMonth && !endMonth) return true;
    if (startMonth && !endMonth) return item.date >= startMonth;
    if (!startMonth && endMonth) return item.date <= endMonth;
    return item.date >= startMonth && item.date <= endMonth;
  });

  const labels = filteredData.map((item) => item.date);
  const cpiIndex = useMemo(() => buildCpiIndex(labels.length), [labels.length, buildCpiIndex, annualInflationPercentInput]);

  // Proyección mensual del tipo de cambio a partir de la variación anual
  const fxPath = useMemo(() => {
    const base = Number(exchangeRate) || 0;
    const monthlyG = annualToMonthly(parseFloat(usdAnnualChangeInput || '0'));
    return Array.from({ length: labels.length }, (_, i) => base * Math.pow(1 + monthlyG, i));
  }, [exchangeRate, usdAnnualChangeInput, labels.length]);

  // Para modo internacional: inflación EE.UU.
  const usCpiIndex = useMemo(() => {
    const usInflation = parseFloat(usInflationInput || '0');
    const monthlyUsInflation = annualToMonthly(usInflation);
    const series = Array.from({ length: labels.length }, () => monthlyUsInflation);
    return cumulativeIndex(series);
  }, [usInflationInput, labels.length]);

  // Inflación acumulada en % (ARG o USA) para modo Detalle en %
  const inflationPctSeries = useMemo(() => {
    const base = detailUnit === 'dolares' ? usCpiIndex : cpiIndex;
    if (!base || base.length === 0) return [];
    // base es índice (1, 1+r, ...). Convertir a % acumulado
    return base.map(v => (v - 1) * 100);
  }, [cpiIndex, usCpiIndex, detailUnit]);

  // Último FX proyectado (para mostrar en la UI)
  const lastProjectedFx = useMemo(() => {
    if (!fxPath || fxPath.length === 0) return null;
    return fxPath[fxPath.length - 1];
  }, [fxPath]);
  
  // Para modo Total: usar los campos que ya incluyen carry_forward del backend
  const totalsWithProjection = useMemo(() => {
    const result = filteredData.map((item, idx) => {
      // Usar los nuevos campos que ya incluyen carry_forward
      const totalARSWithCarry = Number(item.total_ars_with_carry) || 0;
      const totalUSDWithCarry = Number(item.total_usd_with_carry) || 0;
      
      // Aplicar cotización proyectada solo a la porción USD
      const projectedFx = fxPath[idx] || 0;
      const totalUSDInARS = totalUSDWithCarry * projectedFx;
      
      return totalARSWithCarry + totalUSDInARS;
    });
    
    return result;
  }, [filteredData, fxPath, exchangeRate]);
  
  // Solo deflactar la porción ARS, no los USD convertidos
  const totalsReal = useMemo(() => {
    if (!cpiIndex || cpiIndex.length === 0) return [];
    return filteredData.map((item, idx) => {
      const totalARSWithCarry = Number(item.total_ars_with_carry) || 0;
      const totalUSDWithCarry = Number(item.total_usd_with_carry) || 0;
      
      // Solo deflactar la porción ARS
      const arsReal = cpiIndex[idx] ? totalARSWithCarry / cpiIndex[idx] : totalARSWithCarry;
      const usdInPesos = totalUSDWithCarry * (fxPath[idx] || 0);
      
      return arsReal + usdInPesos;
    });
  }, [filteredData, cpiIndex, fxPath]);

  // Línea de referencia: valor inicial ajustado por inflación (Inflación)
  const referenceLine = useMemo(() => {
    if (!totalsWithProjection.length || !cpiIndex.length) return [];
    const initialValue = totalsWithProjection[0] || 0;
    const result = cpiIndex.map(cpi => initialValue * cpi);
    
    
    return result;
  }, [totalsWithProjection, cpiIndex, annualInflationPercentInput]);

  // Análisis de escenarios: ¿le ganaste a la inflación?
  const beatInflation = useMemo(() => {
    if (!totalsReal.length || !referenceLine.length) return null;
    const current = totalsReal[totalsReal.length - 1];
    const reference = referenceLine[referenceLine.length - 1];
    if (!current || !reference) return null;
    
    const percentage = ((current - reference) / reference) * 100;
    
    
    return {
      beat: current > reference,
      percentage: percentage
    };
  }, [totalsReal, referenceLine]);

  // Series ARS y USD usando los nuevos campos del backend
  const { arsSeries, usdSeries } = useMemo(() => {
    const ars = [];
    const usdInPesos = [];
    for (let idx = 0; idx < filteredData.length; idx++) {
      const month = filteredData[idx];
      
      // Usar los nuevos campos que ya incluyen carry_forward
      const totalARSWithCarry = Number(month.total_ars_with_carry) || 0;
      const totalUSDWithCarry = Number(month.total_usd_with_carry) || 0;
      
      const fx = fxPath[idx] || 0;
      ars.push(totalARSWithCarry);
      usdInPesos.push(totalUSDWithCarry * fx);
    }
    return { arsSeries: ars, usdSeries: usdInPesos };
  }, [filteredData, fxPath]);

  // Rendimientos mensuales usando TNA por inversión; excluir si tna es 0 o falta
  const portfolioMonthlyReturnPct = useMemo(() => {
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
        const tna = s.tna != null ? Number(s.tna) : 0;
        if (!tna || tna <= 0) return; // excluir sin TNA
        // r mensual por tipo
        let rMonthly;
        if (s.type === 'fixed') {
          const isMaturity = s.date_to && month.date && String(s.date_to) === String(month.date);
          if (isMaturity) {
            const inv = Number(s.invested) || 0;
            const obt = Number(s.obtained) || 0;
            rMonthly = inv > 0 ? (obt - inv) / inv : 0;
          } else {
            rMonthly = 0;
          }
        } else {
          // tasa mensual nominal aproximada desde TNA
          rMonthly = (tna / 100) / 12;
        }
        // peso: capital del mes en la divisa del ahorro (usar amount si existe, sino invested)
        const amount = Number(s.amount) || 0;
        const invested = Number(s.invested) || 0;
        const weight = amount > 0 ? amount : invested;
        if (weight > 0) {
          weightedSum += rMonthly * weight;
          weightDen += weight;
        }
      });
      result[idx] = weightDen > 0 ? (weightedSum / weightDen) * 100 : 0; // %
    }
    return result;
  }, [filteredData, detailUnit]);

  // Acumulados en %
  const accumulatePct = (rMonthlyPct) => {
    const out = [];
    let acc = 1;
    for (let i = 0; i < rMonthlyPct.length; i++) {
      acc *= (1 + (rMonthlyPct[i] || 0) / 100);
      out.push((acc - 1) * 100);
    }
    return out;
  };

  const portfolioAccumPct = useMemo(() => accumulatePct(portfolioMonthlyReturnPct), [portfolioMonthlyReturnPct]);

  // Series por ahorro (acumulado en %) solo en modo Detalle, filtrando por unidad/divisa
  const detailSavingsDatasets = useMemo(() => {
    if (graphMode !== 'todo') return [];
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

        // Determinar r mensual según tipo
        let rMonthly = null;
        if (s.type === 'fixed') {
          const isMaturity = s.date_to && month.date && String(s.date_to) === String(month.date);
          const inv = Number(s.invested) || 0;
          const obt = Number(s.obtained) || 0;
          rMonthly = isMaturity && inv > 0 ? (obt - inv) / inv : 0;
        } else {
          const tna = s.tna != null ? Number(s.tna) : 0;
          if (!tna || tna <= 0) return;
          rMonthly = (tna / 100) / 12;
        }

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
        entry.acc *= (1 + (rMonthly || 0));
        entry.data[idx] = (entry.acc - 1) * 100;
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
  }, [graphMode, detailUnit, filteredData, labels]);

  const average = useMemo(() => {
    const totalSum = filteredData.reduce((acc, item) => {
      const totalARSWithCarry = Number(item.total_ars_with_carry) || 0;
      const totalUSDWithCarry = Number(item.total_usd_with_carry) || 0;
      const fx = fxPath[filteredData.indexOf(item)] || 0;
      return acc + totalARSWithCarry + (totalUSDWithCarry * fx);
    }, 0);
    return totalSum / (filteredData.length || 1);
  }, [filteredData, fxPath]);

  // Memoizar el cálculo de ahorros agrupados para que responda a cambios de inflación
  const savingsGrouped = useMemo(() => {
    const grouped = {};
    filteredData.forEach((item, itemIndex) => {
      item.saving.forEach((saving) => {
        if (!grouped[saving.name]) {
          grouped[saving.name] = {
            name: saving.name,
            data: Array(labels.length).fill(null),
            borderColor: generateColor(saving.name),
            ccy: saving.ccy, // Guardar la moneda del ahorro
          };
        }
        const savingIndex = labels.indexOf(item.date);
        if (savingIndex !== -1) {
          const amount = Number(saving.amount) || 0;
          let adjustedAmount = amount;
          
          // Ajustar por inflación ARG si es ARS
          if (saving.ccy === 'ARS' && cpiIndex && cpiIndex[itemIndex]) {
            adjustedAmount = amount / cpiIndex[itemIndex];
          }
          
          // Para USD: convertir a pesos y aplicar inflación ARG (no inflación EE.UU.)
          if (saving.ccy === 'USD') {
            const fx = fxPath[itemIndex] || 0;
            const usdInPesos = amount * fx;
            // Aplicar inflación ARG a los pesos convertidos
            if (cpiIndex && cpiIndex[itemIndex]) {
              adjustedAmount = usdInPesos / cpiIndex[itemIndex];
            } else {
              adjustedAmount = usdInPesos;
            }
          }
          
          grouped[saving.name].data[savingIndex] = adjustedAmount;
        }
      });
    });
    return grouped;
  }, [filteredData, labels, cpiIndex, fxPath]);

  const savingsDatasets = Object.values(savingsGrouped).map((saving) => ({
    label: `${saving.name} (${saving.ccy})`,
    data: saving.data,
    borderColor: saving.borderColor,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    pointRadius: 3,
    pointBackgroundColor: '#fff',
    fill: false,
    borderWidth: 2,
    tension: 0.2,
  }));

  const datasets = [
    {
      label: 'Total nominal',
      data: totalsWithProjection,
      borderColor: '#14B8A6',
      backgroundColor: 'rgba(20, 184, 166, 0.15)',
      pointRadius: 3,
      pointBackgroundColor: '#14B8A6',
      borderWidth: 2,
      tension: 0.2,
      fill: false,
    },
  ];

  if (graphMode === 'total+avg') {
    datasets.push({
      label: 'Poder adquisitivo real',
      data: totalsReal,
      borderColor: '#F59E0B',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      pointRadius: 0,
      borderDash: [6, 3],
      borderWidth: 2,
      tension: 0.2,
      fill: false,
    });
  }
  if (graphMode === 'todo') {
    datasets.length = 0;
    datasets.push(
      {
        label: 'Rendimiento total (%)',
        data: portfolioAccumPct,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        pointRadius: 2,
        borderWidth: 2,
        tension: 0.2,
        fill: false,
      },
      ...detailSavingsDatasets,
      {
        label: 'Inflación acumulada (%)',
        data: inflationPctSeries,
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        pointRadius: 0,
        borderDash: [4, 3],
        borderWidth: 2,
        tension: 0.2,
        fill: false,
      }
    );
  }
  if (showAverage && graphMode !== 'todo') {
    datasets.push({
      label: 'Promedio',
      data: Array(labels.length).fill(average),
      borderColor: '#9CA3AF',
      borderDash: [5, 5],
      borderWidth: 2,
      pointRadius: 0,
      fill: false,
    });
  }
  if (showSavings && graphMode !== 'todo') {
    datasets.push(...savingsDatasets);
  }

  const chartData = { labels, datasets };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            if (context.dataset.label === 'Promedio') {
              return `Promedio: ${formatNumber(parseInt(context.raw))}`;
            }
            
            if (graphMode === 'todo') {
              return `${context.dataset.label}: ${Number(context.raw).toFixed(1)}%`;
            }
            
            const isUSD = context.dataset.label.includes('(USD)') || context.dataset.label.includes('USD');
            
            let formattedValue;
            if (isUSD) {
              formattedValue = `u$d ${Math.round(context.raw)}`;
            } else {
              formattedValue = formatNumber(context.raw);
            }
            
            return `${context.dataset.label}: ${formattedValue}`;
          },
          afterLabel: function (context) {
            // Mostrar información adicional para el modo Total
            if (graphMode === 'total+avg' && context.dataset.label === 'Total') {
              const dataIndex = context.dataIndex;
              const month = filteredData[dataIndex];
              if (month) {
                const totalARS = Number(month.total_ars_with_carry) || 0;
                const totalUSD = Number(month.total_usd_with_carry) || 0;
                const carryARS = Number(month.carry_forward_ars) || 0;
                const carryUSD = Number(month.carry_forward_usd) || 0;
                const fx = fxPath[dataIndex] || 0;
                
                return [
                  `ARS: ${formatNumber(totalARS)}`,
                  `USD: u$d ${Math.round(totalUSD)} (${formatNumber(totalUSD * fx)})`,
                  `Carry ARS: ${formatNumber(carryARS)}`,
                  `Carry USD: u$d ${Math.round(carryUSD)}`
                ];
              }
            }
            return null;
          }
        },
      },
      legend: {
        display: true,
        labels: {
          color: '#d1d5db',
          boxWidth: 8,
          padding: 12,
          font: { size: 11 },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: '#374151',
        },
        ticks: {
          color: '#d1d5db',
          font: { size: 10 },
        },
      },
      y: {
        grid: {
          color: '#374151',
        },
        ticks: {
          color: '#d1d5db',
          callback: function (value) {
            if (graphMode === 'todo') {
              return `${Math.round(value)}%`;
            }
            return formatNumber(value);
          },
          font: { size: 10 },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="p-4 rounded-lg shadow-lg" style={{background:'#1F2937', color:'#F3F4F6'}}>
      <div className="flex items-center justify-center mb-3">
        <h2 className="text-xl font-bold text-center">Evolución</h2>
      </div>
      <div className="mb-4 text-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center relative">
            <label className="mb-1" style={{color:'#D1D5DB'}}>Graficar:</label>
            <select
              className="bg-gray-800 text-white rounded px-3 py-1 border"
              style={{background:'#2D3748',borderColor:'#374151'}}
              value={graphMode}
              onChange={(e) => onChangeGraphMode && onChangeGraphMode(e.target.value)}
            >
              <option value="total+avg">Cartera</option>
              <option value="todo">Rendimientos</option>
              
            </select>
          </div>
          {graphMode === 'total+avg' && (
            <div className="text-center text-sm" style={{color:'#9CA3AF'}}>
              <p>¿Cómo evoluciona mi dinero con el tiempo?</p>
            </div>
          )}
          {graphMode === 'todo' && (
            <div className="text-center text-sm" style={{color:'#9CA3AF'}}>
              <p>¿Cómo rinde cada uno de mis ahorros?</p>
            </div>
          )}
          <div className="flex gap-4">
            <div className="flex flex-col items-center relative">
              <label className="mb-1" htmlFor="startMonth" style={{color:'#D1D5DB'}}>Desde:</label>
              <div>
                <button
                  type="button"
                  onClick={() => setStartMonth("")}
                  className="pr-2 text-gray-300 hover:text-gray-400 font-bold text-xl"
                >
                  x
                </button>
                <input
                  type="month"
                  id="startMonth"
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                  className="rounded-md p-1 w-36 text-center cursor-pointer pl-2"
                  style={{ background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937' }}
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                />
              </div>
            </div>
            <div className="flex flex-col items-center relative">
              <label className="mb-1" htmlFor="endMonth" style={{color:'#D1D5DB'}}>Hasta:</label>
              <div>
                <input
                  type="month"
                  id="endMonth"
                  value={endMonth}
                  onChange={(e) => setEndMonth(e.target.value)}
                  className="rounded-md p-1 w-36 text-center cursor-pointer pr-2"
                  style={{ background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937' }}
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                />
                <button
                  type="button"
                  onClick={() => setEndMonth("")}
                  className="pl-2 text-gray-300 hover:text-gray-400 font-bold text-xl"
                >
                  x
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3 mt-2">
            {(graphMode !== 'todo' || (graphMode === 'todo' && detailUnit === 'pesos')) && (
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <label style={{color:'#D1D5DB'}}>Inflación anual ARG (%)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={annualInflationPercentInput}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === '') { setAnnualInflationPercentInput(''); return; }
                      const digits = raw.replace(/[^0-9]/g, '');
                      const sanitized = digits.replace(/^0+(\d)/, '$1');
                      setAnnualInflationPercentInput(sanitized);
                    }}
                    className="rounded-md p-1 w-14 text-center"
                    style={{ background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937' }}
                  />
                </div>
              </div>
            )}
            {graphMode === 'todo' && detailUnit === 'dolares' && (
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <label style={{color:'#D1D5DB'}}>Inflación anual EE.UU. (%)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={usInflationInput}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === '') { setUsInflationInput(''); return; }
                      const sanitized = raw.replace(/[^0-9.]/g, '');
                      setUsInflationInput(sanitized);
                    }}
                    className="rounded-md p-1 w-14 text-center"
                    style={{ background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937' }}
                  />
                </div>
              </div>
            )}
            {graphMode !== 'todo' && (
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <label className="mb-0" style={{color:'#D1D5DB'}}>Suba del dólar (%)</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={usdAnnualChangeInput}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === '') { setUsdAnnualChangeInput(''); return; }
                      const digits = raw.replace(/[^0-9]/g, '');
                      const sanitized = digits.replace(/^0+(\d)/, '$1');
                      setUsdAnnualChangeInput(sanitized);
                    }}
                    className="rounded-l-md p-1 w-14 text-center"
                    style={{ background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937', borderRight:'none' }}
                  />
                  {lastProjectedFx != null && (
                    <div className="text-center text-[9px] w-10 rounded-r-md py-0.5 px-1 flex items-center justify-center" style={{color:'#9CA3AF', background:'#2D3748', border:'1px solid #1F2937', borderLeft:'1px solid #4B5563', lineHeight:'1.2'}}>
                      USD ${Math.round(lastProjectedFx)}
                    </div>
                  )}
                </div>
              </div>
            </div>
            )}
          </div>
          {graphMode === 'todo' && (
            <div className="text-center text-sm" style={{color:'#9CA3AF'}}>
              <div className="flex justify-center gap-4 mt-2">
                <label className="inline-flex items-center gap-2" style={{color:'#D1D5DB'}}>
                  <input
                    type="radio"
                    name="detailUnit"
                    value="pesos"
                    checked={detailUnit === 'pesos'}
                    onChange={(e) => setDetailUnit(e.target.value)}
                  />
                  Rendimientos en Pesos
                </label>
                <label className="inline-flex items-center gap-2" style={{color:'#D1D5DB'}}>
                  <input
                    type="radio"
                    name="detailUnit"
                    value="dolares"
                    checked={detailUnit === 'dolares'}
                    onChange={(e) => setDetailUnit(e.target.value)}
                  />
                  Rendimientos en Dólares
                </label>
              </div>
            </div>
          )}
          {graphMode === 'total+avg' && totalsReal && totalsReal.length > 0 && (
            <div className="text-center text-sm" style={{color:'#F59E0B'}}>
              <p>Poder adquisitivo: {formatNumber(Math.round(totalsReal[totalsReal.length - 1]))}</p>
            </div>
          )}
          {graphMode === 'todo' && portfolioAccumPct && portfolioAccumPct.length > 0 && (
            <div className="text-center text-sm" style={{color:'#10B981'}}>
              {(() => {
                const r_acum = portfolioAccumPct[portfolioAccumPct.length - 1] / 100;
                return <p>Rendimiento del periodo: {(r_acum * 100).toFixed(1)}% {detailUnit === 'dolares' ? '(en Dólares)' : '(en Pesos)'}</p>;
              })()}
            </div>
          )}
        </div>
      </div>
      <div style={{height: '300px'}}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

// Paleta de colores fijos para las referencias
const FIXED_COLORS = [
  '#3B82F6', // Azul
  '#10B981', // Verde
  '#F59E0B', // Amarillo
  '#EF4444', // Rojo
  '#8B5CF6', // Púrpura
  '#06B6D4', // Cian
  '#F97316', // Naranja
  '#84CC16', // Lima
  '#EC4899', // Rosa
  '#6B7280', // Gris
  '#14B8A6', // Teal
  '#F43F5E', // Rose
];

const generateColor = (name) => {
  // Usar las primeras letras del nombre para una distribución más uniforme
  const firstChar = name.charCodeAt(0) || 0;
  const secondChar = name.charCodeAt(1) || 0;
  const thirdChar = name.charCodeAt(2) || 0;
  
  // Combinar caracteres para obtener un índice más distribuido
  const combined = (firstChar + secondChar * 2 + thirdChar * 3) % FIXED_COLORS.length;
  return FIXED_COLORS[combined];
};

export default GraphComponent;
