export const buildTooltipCallbacks = ({ graphMode, formatNumber, filteredData, fxPath }) => ({
  label: function (context) {
    if (context.dataset.label === 'Promedio') {
      return `Promedio: ${formatNumber(parseInt(context.raw))}`;
    }
    
    if (graphMode === 'rendimiento') {
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
    if (graphMode === 'portafolio' && context.dataset.label === 'Total') {
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
});

// Construir opciones del gráfico
export const buildOptions = ({ graphMode, formatNumber, filteredData, fxPath }) => {
  const callbacks = buildTooltipCallbacks({ graphMode, formatNumber, filteredData, fxPath });
  
  return {
    responsive: true,
    plugins: {
      title: {
        display: false,
      },
      tooltip: {
        callbacks,
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
            if (graphMode === 'rendimiento') {
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
};

// Construir datasets del gráfico
export const buildDatasets = ({ 
  graphMode, 
  totalsWithProjection, 
  totalsReal, 
  portfolioAccumPct, 
  detailSavingsDatasets, 
  inflationPctSeries, 
  labels, 
  showAverage, 
  average 
}) => {
  if (graphMode === 'rendimiento') {
    return [
      {
        label: 'Rendimiento total (%)',
        data: portfolioAccumPct,
        borderColor: '#16A085',
        backgroundColor: 'rgba(39, 174, 96, 0.1)',
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
    ];
  }

  const base = [
    {
      label: 'Total nominal',
      data: totalsWithProjection,
      borderColor: '#16A085',
      backgroundColor: 'rgba(39, 174, 96, 0.15)',
      pointRadius: 3,
      pointBackgroundColor: '#16A085',
      borderWidth: 2,
      tension: 0.2,
      fill: false,
    }
  ];

  if (graphMode === 'portafolio') {
    base.push({
      label: 'Poder adquisitivo',
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

  if (showAverage) {
    base.push({
      label: 'Promedio',
      data: Array(labels.length).fill(average),
      borderColor: '#9CA3AF',
      borderDash: [5, 5],
      borderWidth: 2,
      pointRadius: 0,
      fill: false,
    });
  }

  return base;
};
