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
import {
  calculateTotalsWithProjection,
  calculateTotalsReal,
  calculatePortfolioMonthlyReturns,
  accumulatePct,
  calculateAverage,
  generateDetailSavingsDatasets
} from '../utils/graphCalculations';
import { buildDatasets, buildOptions } from '../utils/chartConfiguration';
import { generateColor } from '../utils/chartColors';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

// Helpers locales
const toNum = (v) => Number(v) || 0;
const sanitizeInt = (v) => v === '' ? '' : v.replace(/[^0-9]/g, '').replace(/^0+(\d)/, '$1');
const sanitizeFloat = (v) => v === '' ? '' : v.replace(/[^0-9.]/g, '');

const labelMuted = { color:'#D1D5DB' };

const GraphComponent = ({ data, showAverage = false, graphMode, onChangeGraphMode }) => {
  const [startMonth, setStartMonth] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const { buildCpiIndex, annualInflationPercentInput, setAnnualInflationPercentInput } = useInflation();
  const { exchangeRate } = useExchangeRate();
  const [usdAnnualChangeInput, setUsdAnnualChangeInput] = useState('0');
  const [usInflationInput, setUsInflationInput] = useState('3');
  const [detailUnit, setDetailUnit] = useState('pesos');

  // Flags precomputados
  const isReturns = graphMode === 'rendimiento';
  const isPesos = detailUnit === 'pesos';

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
    const base = toNum(exchangeRate);
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
    const base = isPesos ? cpiIndex : usCpiIndex;
    if (!base || base.length === 0) return [];
    // base es índice (1, 1+r, ...). Convertir a % acumulado
    return base.map(v => (v - 1) * 100);
  }, [cpiIndex, usCpiIndex, isPesos]);

  // Último FX proyectado (para mostrar en la UI)
  const lastProjectedFx = useMemo(() => {
    if (!fxPath || fxPath.length === 0) return null;
    return fxPath[fxPath.length - 1];
  }, [fxPath]);
  
  // Para modo Total: usar los campos que ya incluyen carry_forward del backend
  const totalsWithProjection = useMemo(() => 
    calculateTotalsWithProjection(filteredData, fxPath), 
    [filteredData, fxPath]
  );
  
  // Deflactar ARS con CPI ARG y USD con CPI USA
  const totalsReal = useMemo(() => 
    calculateTotalsReal(filteredData, cpiIndex, usCpiIndex, fxPath), 
    [filteredData, cpiIndex, usCpiIndex, fxPath]
  );

  const portfolioMonthlyReturnPct = useMemo(() => 
    calculatePortfolioMonthlyReturns(filteredData, detailUnit), 
    [filteredData, detailUnit]
  );

  const portfolioAccumPct = useMemo(() => 
    accumulatePct(portfolioMonthlyReturnPct), 
    [portfolioMonthlyReturnPct]
  );

  // Series por ahorro (acumulado en %) solo en modo Detalle, filtrando por unidad/divisa
  const detailSavingsDatasets = useMemo(() => {
    if (!isReturns) return [];
    return generateDetailSavingsDatasets(filteredData, labels, detailUnit, generateColor);
  }, [isReturns, filteredData, labels, detailUnit]);

  const average = useMemo(() => 
    calculateAverage(filteredData, fxPath), 
    [filteredData, fxPath]
  );

  const datasets = buildDatasets({
    graphMode,
    totalsWithProjection,
    totalsReal,
    portfolioAccumPct,
    detailSavingsDatasets,
    inflationPctSeries,
    labels,
    showAverage,
    average
  });

  const chartData = { labels, datasets };
  const options = buildOptions({ graphMode, formatNumber, filteredData, fxPath });

  return (
    <div className="p-4 rounded-lg shadow-lg" style={{background:'#1F2937', color:'#F3F4F6'}}>
      <div className="flex items-center justify-center mb-3">
        <h2 className="text-xl font-bold text-center">Proyección del Portafolio</h2>
      </div>
      <div className="mb-4 text-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center relative">
            <label className="mb-1" style={labelMuted}>Graficar:</label>
            <select
              className="bg-gray-800 text-white rounded px-3 py-1 border"
              style={{background:'#2D3748',borderColor:'#374151'}}
              value={graphMode}
              onChange={(e) => onChangeGraphMode && onChangeGraphMode(e.target.value)}
            >
              <option value="portafolio">Portafolio</option>
              <option value="rendimiento">Rendimientos</option>
              
            </select>
          </div>
          {graphMode === 'portafolio' && (
            <div className="text-center text-base" style={{color:'#9CA3AF'}}>
              <p>¿Cuánto tendré y cuánto valdrá?</p>
            </div>
          )}
          {graphMode === 'rendimiento' && (
            <div className="text-center text-base" style={{color:'#9CA3AF'}}>
              <p>¿Rinden por encima de la inflación?</p>
            </div>
          )}
          {graphMode === 'rendimiento' && (
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
                  En Pesos
                </label>
                <label className="inline-flex items-center gap-2" style={{color:'#D1D5DB'}}>
                  <input
                    type="radio"
                    name="detailUnit"
                    value="dolares"
                    checked={detailUnit === 'dolares'}
                    onChange={(e) => setDetailUnit(e.target.value)}
                  />
                  En Dólares
                </label>
              </div>
            </div>
          )}
          <div className="flex flex-col md:flex-row items-center gap-3 mt-2">
            {(graphMode !== 'rendimiento' || (graphMode === 'rendimiento' && detailUnit === 'pesos')) && (
              <div className="flex flex-col items-center gap-1 text-xs">
                <div className="flex items-center gap-2">
                  <label style={{color:'#D1D5DB'}}>Inflación ARG</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={annualInflationPercentInput}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === '') { setAnnualInflationPercentInput(''); return; }
                        setAnnualInflationPercentInput(sanitizeInt(raw));
                      }}
                      className="rounded-md p-1 pr-5 w-16 text-center"
                      style={{ background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937', paddingRight:'18px' }}
                    />
                    <span className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                  </div>
                </div>
              </div>
            )}
            {(graphMode !== 'rendimiento' || (graphMode === 'rendimiento' && detailUnit === 'dolares')) && (
              <div className="flex flex-col items-center gap-1 text-xs">
                <div className="flex items-center gap-2">
                  <label style={{color:'#D1D5DB'}}>Inflación EUA</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={usInflationInput}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === '') { setUsInflationInput(''); return; }
                        setUsInflationInput(sanitizeFloat(raw));
                      }}
                      className="rounded-md p-1 pr-5 w-16 text-center"
                      style={{ background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937', paddingRight:'18px' }}
                    />
                    <span className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                  </div>
                </div>
              </div>
            )}
            {graphMode !== 'rendimiento' && (
            <div className="flex flex-col items-center gap-1 text-xs">
              <div className="flex items-center gap-2">
                <label style={{color:'#D1D5DB'}}>Aumento dólar</label>
                <div className="flex items-center">
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={usdAnnualChangeInput}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === '') { setUsdAnnualChangeInput(''); return; }
                        setUsdAnnualChangeInput(sanitizeInt(raw));
                      }}
                      className="rounded-l-md p-1 pr-5 w-16 text-center"
                      style={{ background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937', borderRight:'none', paddingRight:'18px' }}
                    />
                    <span className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                  </div>
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
          <div className="flex gap-4">
            <div className="flex flex-col items-center relative text-xs">
              <label htmlFor="startMonth" style={{color:'#D1D5DB'}}>Desde:</label>
              <div>
                <button
                  type="button"
                  onClick={() => setStartMonth("")}
                  className="pr-2 text-gray-300 hover:text-gray-400 font-bold text-sm"
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
            <div className="flex flex-col items-center relative text-xs">
              <label htmlFor="endMonth" style={{color:'#D1D5DB'}}>Hasta:</label>
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
                  className="pl-2 text-gray-300 hover:text-gray-400 font-bold text-sm"
                >
                  x
                </button>
              </div>
            </div>
          </div>
          
          {graphMode === 'portafolio' && totalsReal && totalsReal.length > 0 && totalsWithProjection && totalsWithProjection.length > 0 && (
            <div className="text-center text-sm">
              {(() => {
                const lastReal = Math.round(totalsReal[totalsReal.length - 1] || 0);
                const lastNominal = Math.round(totalsWithProjection[totalsWithProjection.length - 1] || 0);
                return (
                  <p className="text-gray-400">
                    Total: <span className="font-semibold text-gray-200">{formatNumber(lastNominal)}</span> · Real: <span className="font-semibold text-gray-200">{formatNumber(lastReal)}</span>
                  </p>
                );
              })()}
            </div>
          )}
          {graphMode === 'rendimiento' && portfolioAccumPct && portfolioAccumPct.length > 0 && (
            <div className="text-center text-sm" style={{color:'#9CA3AF'}}>
              {(() => {
                const r_acum = portfolioAccumPct[portfolioAccumPct.length - 1] / 100;
                return (
                  <p className="text-gray-400">
                    Rendimiento del período: <span className="font-semibold text-gray-200">{(r_acum * 100).toFixed(1)}%</span> {detailUnit === 'dolares' ? '(USD)' : '(ARS)'}
                  </p>
                );
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


export default GraphComponent;
