import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
import { useExchangeRate } from '../context/ExchangeRateContext';
import { formatNumber } from '../utils/numbers';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const PieChartCcyComponent = ({ title, data }) => {
  const { exchangeRate } = useExchangeRate();
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthData = data?.find(item => item.date === currentMonth);

  if (!monthData) return null;

  const currencyTotals = monthData.saving.reduce((acc, { ccy, obtained, invested }) => {
    const value = (obtained && obtained !== 0) ? obtained : invested;
    const adjustedValue = ccy !== 'ARS' ? value * exchangeRate : value;
    acc[ccy] = (acc[ccy] || 0) + adjustedValue;
    return acc;
  }, {});

  const total = Object.values(currencyTotals).reduce((sum, value) => sum + value, 0);

  const labels = Object.keys(currencyTotals);
  const values = Object.values(currencyTotals);
  // Paleta consistente con la app: ARS celeste (sky), USD verde corporativo
  const backgroundColor = labels.map(l => l === 'ARS' ? '#60A5FA' : '#16A085');
  const hoverBackgroundColor = labels.map(l => l === 'ARS' ? '#93C5FD' : '#138D75');

  const chartData = {
    labels,
    datasets: [{
      data: values,
      backgroundColor,
      hoverBackgroundColor,
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#F3F4F6' } },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F3F4F6',
        bodyColor: '#F3F4F6',
        callbacks: {
          title: (tooltipItem) => {
            const label = tooltipItem[0].label;
            const value = tooltipItem[0].raw;
            const percentage = ((value / total) * 100).toFixed(0);
            return `${label} (${percentage}%)`;
          },
          label: (tooltipItem) => {
            const label = tooltipItem.label;
            const value = tooltipItem.raw;
            const percentage = ((value / total) * 100).toFixed(0);
            return `${label !== 'ARS' ? `${formatNumber(value)} (${value / exchangeRate} ${label})` : formatNumber(value)}`;
          },
        },
      },
    },
    elements: { arc: { borderWidth: 1 } },
  };

  return (
    <div className="flex flex-col items-center p-4 rounded-lg shadow-md" style={{background:'#1F2937', color:'#F3F4F6'}}>
      <h2 className="text-xl font-bold mb-4">{title} ({currentMonth})</h2>
      <div className="h-52">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PieChartCcyComponent;
