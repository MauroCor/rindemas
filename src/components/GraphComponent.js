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
  const [powerMode, setPowerMode] = useState('local'); // 'local' o 'international'

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
    // Si no hay filtros, mostrar todo
    if (!startMonth && !endMonth) return true;
    
    // Si solo hay fecha desde, mostrar desde esa fecha hasta el final
    if (startMonth && !endMonth) return item.date >= startMonth;
    
    // Si solo hay fecha hasta, mostrar desde el inicio hasta esa fecha
    if (!startMonth && endMonth) return item.date <= endMonth;
    
    // Si hay ambas fechas, mostrar el rango
    return item.date >= startMonth && item.date <= endMonth;
  });

  const labels = filteredData.map((item) => item.date);
  const totals = filteredData.map((item) => Number(item.total) || 0);
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
  
  // Para modo Total: recalcular con proyección del dólar
  const totalsWithProjection = useMemo(() => {
    return filteredData.map((item, idx) => {
      let sumARS = 0;
      let sumUSD = 0;
      item.saving.forEach((saving) => {
        const amount = saving.amount;
        if (saving.ccy === 'ARS') {
          sumARS += Number(amount) || 0;
        } else {
          sumUSD += Number(amount) || 0;
        }
      });
      
      // En modo "Detalle", aplicar inflaciones correspondientes
      if (graphMode === 'todo') {
        // Aplicar inflación argentina a ARS si existe
        if (cpiIndex && cpiIndex[idx]) {
          sumARS = sumARS / cpiIndex[idx];
        }
        // Aplicar inflación estadounidense a USD si existe
        if (usCpiIndex && usCpiIndex[idx]) {
          sumUSD = sumUSD / usCpiIndex[idx];
        }
      }
      
      const fx = fxPath[idx] || 0;
      return sumARS + (sumUSD * fx);
    });
  }, [filteredData, fxPath, graphMode, usCpiIndex, cpiIndex]);
  
  // Solo deflactar la porción ARS, no los USD convertidos
  const totalsReal = useMemo(() => {
    if (!cpiIndex || cpiIndex.length === 0) return [];
    return filteredData.map((item, idx) => {
      let sumARS = 0;
      let sumUSD = 0;
      item.saving.forEach((saving) => {
        const amount = saving.amount;
        if (saving.ccy === 'ARS') {
          sumARS += Number(amount) || 0;
        } else {
          sumUSD += Number(amount) || 0;
        }
      });
      const fx = fxPath[idx] || 0;
      // Solo deflactar ARS, USD se mantiene nominal
      const arsReal = cpiIndex[idx] ? sumARS / cpiIndex[idx] : sumARS;
      const usdInPesos = sumUSD * fx;
      return arsReal + usdInPesos;
    });
  }, [filteredData, fxPath, cpiIndex]);

  // Línea de referencia: valor inicial ajustado por inflación (Inflación)
  const referenceLine = useMemo(() => {
    if (!totalsWithProjection.length || !cpiIndex.length) return [];
    const initialValue = totalsWithProjection[0] || 0;
    return cpiIndex.map(cpi => initialValue * cpi);
  }, [totalsWithProjection, cpiIndex]);

  // Análisis de escenarios: ¿le ganaste a la inflación?
  const beatInflation = useMemo(() => {
    if (!totalsWithProjection.length || !referenceLine.length) return null;
    const current = totalsWithProjection[totalsWithProjection.length - 1];
    const reference = referenceLine[referenceLine.length - 1];
    if (!current || !reference) return null;
    return {
      beat: current > reference,
      percentage: ((current - reference) / reference) * 100
    };
  }, [totalsWithProjection, referenceLine]);

  // Series ARS y USD (convertido a pesos) por mes
  const { arsSeries, usdSeries } = useMemo(() => {
    const ars = [];
    const usdInPesos = [];
    for (let idx = 0; idx < filteredData.length; idx++) {
      const month = filteredData[idx];
      let sumARS = 0;
      let sumUSD = 0; // en USD
      month.saving.forEach((saving) => {
        const amount = saving.amount;
        if (saving.ccy === 'ARS') {
          sumARS += Number(amount) || 0;
        } else {
          sumUSD += Number(amount) || 0;
        }
      });
      const fx = fxPath[idx] || 0;
      ars.push(sumARS);
      usdInPesos.push(sumUSD * fx);
    }
    return { arsSeries: ars, usdSeries: usdInPesos };
  }, [filteredData, fxPath]);

  // Para modo ARS vs USD: usar inflación local o internacional según powerMode
  const currentCpiIndex = useMemo(() => {
    if (powerMode === 'international') {
      return usCpiIndex;
    }
    return cpiIndex;
  }, [powerMode, cpiIndex, usCpiIndex]);

  const arsSeriesAdj = useMemo(() => {
    if (!currentCpiIndex || currentCpiIndex.length === 0) return arsSeries;
    
    // En modo internacional, convertir ARS a dólares
    if (graphMode === 'ars-usd' && powerMode === 'international') {
      return arsSeries.map((v, i) => {
        const adjustedValue = currentCpiIndex[i] ? v / currentCpiIndex[i] : v;
        const fx = fxPath[i] || 0;
        return fx > 0 ? adjustedValue / fx : 0;
      });
    }
    
    // En otros modos, solo ajustar por inflación
    return arsSeries.map((v, i) => (currentCpiIndex[i] ? v / currentCpiIndex[i] : v));
  }, [arsSeries, currentCpiIndex, graphMode, powerMode, fxPath]);

  const usdSeriesAdj = useMemo(() => {
    if (!currentCpiIndex || currentCpiIndex.length === 0) return usdSeries;
    
    // En modo internacional, usar USD originales (sin convertir a pesos)
    if (graphMode === 'ars-usd' && powerMode === 'international') {
      // Recalcular USD originales desde los datos
      const usdOriginales = [];
      for (let idx = 0; idx < filteredData.length; idx++) {
        const month = filteredData[idx];
        let sumUSD = 0; // en USD originales
        month.saving.forEach((saving) => {
          if (saving.ccy === 'USD') {
            sumUSD += Number(saving.amount) || 0;
          }
        });
        usdOriginales.push(sumUSD);
      }
      return usdOriginales.map((v, i) => (currentCpiIndex[i] ? v / currentCpiIndex[i] : v));
    }
    
    // En otros modos, ajustar por inflación y convertir a pesos
    return usdSeries.map((v, i) => {
      const adjustedValue = currentCpiIndex[i] ? v / currentCpiIndex[i] : v;
      const fx = fxPath[i] || 0;
      return adjustedValue * fx;
    });
  }, [usdSeries, currentCpiIndex, graphMode, powerMode, fxPath, filteredData]);

  const average = totals.reduce((acc, val) => acc + val, 0) / (totals.length || 1);

  const savingsGrouped = {};
  filteredData.forEach((item, itemIndex) => {
    item.saving.forEach((saving) => {
      if (!savingsGrouped[saving.name]) {
        savingsGrouped[saving.name] = {
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
        
        // Convertir USD a pesos y ajustar por inflación EE.UU.
        if (saving.ccy === 'USD') {
          const fx = fxPath[itemIndex] || 0;
          // Primero ajustar por inflación EE.UU. en dólares
          let usdAdjusted = amount;
          if (usCpiIndex && usCpiIndex[itemIndex]) {
            usdAdjusted = amount / usCpiIndex[itemIndex];
          }
          // Luego convertir a pesos
          adjustedAmount = usdAdjusted * fx;
        }
        
        savingsGrouped[saving.name].data[savingIndex] = adjustedAmount;
      }
    });
  });

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
      label: 'Total',
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
  if (graphMode === 'ars-usd') {
    // Reemplazar datasets por ARS vs USD (local o internacional según powerMode)
    datasets.length = 0;
    datasets.push(
      {
        label: powerMode === 'international' ? 'ARS en dólares' : 'ARS',
        data: arsSeriesAdj,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        pointRadius: 2,
        borderWidth: 2,
        tension: 0.2,
        fill: false,
      },
      {
        label: powerMode === 'international' ? 'USD' : 'USD en pesos',
        data: usdSeriesAdj,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        pointRadius: 2,
        borderWidth: 2,
        tension: 0.2,
        fill: false,
      }
    );
  }
  if (graphMode === 'total+avg') {
    datasets.push({
      label: 'Pesos reales',
      data: totalsReal,
      borderColor: '#F59E0B',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      pointRadius: 0,
      borderDash: [6, 3],
      borderWidth: 2,
      tension: 0.2,
      fill: false,
    });
    // Línea de referencia: Inflación
    datasets.push({
      label: 'Valor con inflación',
      data: referenceLine,
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      pointRadius: 0,
      borderDash: [2, 2],
      borderWidth: 1,
      tension: 0,
      fill: false,
    });
  }
  if (showAverage) {
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
  if (showSavings) {
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
            
            // En modo "Detalle", todos los valores están en pesos (incluso los USD convertidos)
            if (graphMode === 'todo') {
              return `${context.dataset.label}: ${formatNumber(context.raw)}`;
            }
            
            // Para otros modos, determinar la moneda basada en el nombre del dataset
            const isUSD = context.dataset.label.includes('(USD)') || context.dataset.label.includes('USD');
            
            // En modo "ARS vs USD", formatear según powerMode
            if (graphMode === 'ars-usd') {
              if (powerMode === 'international') {
                // En modo internacional, ambos valores están en dólares
                return `${context.dataset.label}: u$d ${Math.round(context.raw)}`;
              } else {
                // En modo local, ambos valores están en pesos
                return `${context.dataset.label}: ${formatNumber(context.raw)}`;
              }
            }
            
            // Para otros modos, formatear según la moneda original
            let formattedValue;
            if (isUSD) {
              formattedValue = `u$d ${Math.round(context.raw)}`;
            } else {
              formattedValue = formatNumber(context.raw);
            }
            
            return `${context.dataset.label}: ${formattedValue}`;
          },
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
            // En modo "ARS vs USD" con powerMode internacional, mostrar dólares
            if (graphMode === 'ars-usd' && powerMode === 'international') {
              return `u$d ${Math.round(value)}`;
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
              <option value="total+avg">Total</option>
              <option value="todo">Detalle</option>
              <option value="ars-usd">ARS vs USD</option>
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
          {graphMode === 'ars-usd' && (
            <div className="text-center text-sm" style={{color:'#9CA3AF'}}>
              <p>¿Qué divisa preserva mejor mi poder de compra?</p>
              <div className="flex justify-center gap-4 mt-2">
                <label className="inline-flex items-center gap-2" style={{color:'#D1D5DB'}}>
                  <input
                    type="radio"
                    name="powerMode"
                    value="local"
                    checked={powerMode === 'local'}
                    onChange={(e) => setPowerMode(e.target.value)}
                  />
                  En Pesos
                </label>
                <label className="inline-flex items-center gap-2" style={{color:'#D1D5DB'}}>
                  <input
                    type="radio"
                    name="powerMode"
                    value="international"
                    checked={powerMode === 'international'}
                    onChange={(e) => setPowerMode(e.target.value)}
                  />
                  En Dólares
                </label>
              </div>
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
            {!(graphMode === 'ars-usd' && powerMode === 'international') && (
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <label style={{color:'#D1D5DB'}}>Inflación ARG (%)</label>
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
            {graphMode === 'todo' && (
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <label style={{color:'#D1D5DB'}}>Inflación EE.UU. (%)</label>
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
                  {exchangeRate && (
                    <div className="text-center text-[9px] w-10 rounded-r-md py-0.5 px-1 flex items-center justify-center" style={{color:'#9CA3AF', background:'#2D3748', border:'1px solid #1F2937', borderLeft:'1px solid #4B5563', lineHeight:'1.2'}}>
                      USD ${usdAnnualChangeInput && Number(usdAnnualChangeInput) > 0 ? 
                        Math.round(Number(exchangeRate) * (1 + Number(usdAnnualChangeInput) / 100)) : 
                        Math.round(Number(exchangeRate))
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>
            {graphMode === 'ars-usd' && powerMode === 'international' && (
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <label style={{color:'#D1D5DB'}}>Inflación EE.UU. (%)</label>
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
          </div>
          {graphMode === 'ars-usd' && powerMode === 'local' && arsSeriesAdj.length > 0 && usdSeriesAdj.length > 0 && (
            <div className="text-center text-xs" style={{color:'#F59E0B'}}>
              {(() => {
                const arsStart = arsSeriesAdj[0];
                const arsEnd = arsSeriesAdj[arsSeriesAdj.length - 1];
                const usdStart = usdSeriesAdj[0];
                const usdEnd = usdSeriesAdj[usdSeriesAdj.length - 1];
                
                if (arsStart && arsEnd && usdStart && usdEnd) {
                  const arsGain = ((arsEnd - arsStart) / arsStart) * 100;
                  const usdGain = ((usdEnd - usdStart) / usdStart) * 100;
                  const netGain = arsGain - usdGain;
                  
                  if (netGain > 0) {
                    return `El peso superó al dólar en ${netGain.toFixed(1)}% de poder de compra local`;
                  } else if (netGain < 0) {
                    return `El dólar superó al peso en ${Math.abs(netGain).toFixed(1)}% de poder de compra local`;
                  } else {
                    return `Peso y dólar tienen el mismo poder de compra local`;
                  }
                }
                return '';
              })()}
            </div>
          )}
          {graphMode === 'ars-usd' && powerMode === 'international' && arsSeriesAdj.length > 0 && usdSeriesAdj.length > 0 && (
            <div className="text-center text-xs" style={{color:'#F59E0B'}}>
              {(() => {
                const arsStart = arsSeriesAdj[0];
                const arsEnd = arsSeriesAdj[arsSeriesAdj.length - 1];
                const usdStart = usdSeriesAdj[0];
                const usdEnd = usdSeriesAdj[usdSeriesAdj.length - 1];
                
                if (arsStart && arsEnd && usdStart && usdEnd) {
                  const arsGain = ((arsEnd - arsStart) / arsStart) * 100;
                  const usdGain = ((usdEnd - usdStart) / usdStart) * 100;
                  const netGain = arsGain - usdGain;
                  
                  if (netGain > 0) {
                    return `El peso superó al dólar en ${netGain.toFixed(1)}% de poder de compra internacional`;
                  } else if (netGain < 0) {
                    return `El dólar superó al peso en ${Math.abs(netGain).toFixed(1)}% de poder de compra internacional`;
                  } else {
                    return `Peso y dólar tienen el mismo poder de compra internacional`;
                  }
                }
                return '';
              })()}
            </div>
          )}
          {graphMode === 'total+avg' && beatInflation && (
              <div className="text-center text-sm" style={{color:'#F59E0B'}}>
                {beatInflation.beat ? (
                  <p>Tu portafolio supera a la inflación ARG en {beatInflation.percentage.toFixed(1)}%</p>
                ) : (
                  <p>La inflación ARG supera a tu portafolio en {Math.abs(beatInflation.percentage).toFixed(1)}%</p>
                )}
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
