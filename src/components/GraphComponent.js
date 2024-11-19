import React from 'react';
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
import { formatNumber } from '../utils/numbers';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const GraphComponent = ({ data }) => {
  const labels = data.map((item) => item.date);
  const totals = data.map((item) => item.total);

  const average = totals.reduce((acc, val) => acc + val, 0) / totals.length;

  // Configuración de datos para Chart.js
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Total por mes',
        data: totals,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        pointRadius: 5,
        pointBackgroundColor: '#3b82f6',
        tension: 0.3,
      },
      {
        label: 'Promedio',
        data: Array(totals.length).fill(average),
        borderColor: '#facc15',
        borderDash: [5, 5],
        pointRadius: 0,
      },
    ],
  };

  // Configuración de opciones para el diseño y la interacción
  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            if (context.dataset.label === 'Promedio') {
              return `Promedio: ${formatNumber(context.raw)}`;
            }
            return `Mes ${context.label}: ${formatNumber(context.raw)}`;
          },
        },
      },
      legend: {
        display: true,
        labels: {
          color: '#d1d5db',
          boxWidth: 1,
          padding: 10, 
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: '#4b5563',
        },
        ticks: {
          color: '#d1d5db',
        },
      },
      y: {
        grid: {
          color: '#4b5563',
        },
        ticks: {
          color: '#d1d5db',
          callback: function (value) {
            return formatNumber(value);
          },
        },
      },
    },
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold text-white mb-4">Evolución de Ahorros</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default GraphComponent;
