import React, { useState } from 'react';
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
  const [startMonth, setStartMonth] = useState('');
  const [endMonth, setEndMonth] = useState('');

  // Procesar datos para incluir campo "amount"
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

  // Filtrar datos según el rango de meses
  const filteredData = datagraph.filter((item) => {
    if (!startMonth || !endMonth) return true;
    return item.date >= startMonth && item.date <= endMonth;
  });

  if (filteredData.length === 0) {
    return;
  }

  const labels = filteredData.map((item) => item.date);
  const totals = filteredData.map((item) => item.total);
  const average = totals.reduce((acc, val) => acc + val, 0) / (totals.length || 1);

  // Agrupar ahorros por nombre
  const savingsGrouped = {};
  filteredData.forEach((item) => {
    item.saving.forEach((saving) => {
      if (!savingsGrouped[saving.name]) {
        savingsGrouped[saving.name] = {
          name: saving.name,
          data: Array(labels.length).fill(null),
          borderColor: generateColor(),
        };
      }
      const savingIndex = labels.indexOf(item.date);
      if (savingIndex !== -1) {
        savingsGrouped[saving.name].data[savingIndex] = saving.amount;
      }
    });
  });

  const savingsDatasets = Object.values(savingsGrouped).map((saving) => ({
    label: saving.name,
    data: saving.data,
    borderColor: saving.borderColor,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    pointRadius: 3,
    pointBackgroundColor: '#fff',
    fill: false,
    borderWidth: 2,
    tension: 0.2,
  }));

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Total',
        data: totals,
        borderColor: '#14B8A6',
        backgroundColor: 'rgba(20, 184, 166, 0.15)',
        pointRadius: 3,
        pointBackgroundColor: '#14B8A6',
        borderWidth: 2,
        tension: 0.2,
        fill: false,
      },
      {
        label: 'Promedio',
        data: Array(labels.length).fill(average),
        borderColor: '#9CA3AF',
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
      },
      ...savingsDatasets,
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            if (context.dataset.label === 'Promedio') {
              return `Promedio: $${parseInt(context.raw)}`;
            }
            return `${context.dataset.label}: $${context.raw}`;
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
    <div className="p-4 rounded-lg shadow-lg" style={{background:'#1F2937', color:'#F3F4F6'}}>
      <h2 className="text-lg font-bold mb-4">Evolución de Ahorros</h2>
      <div className="mb-4 text-sm">
        <div className="grid grid-cols-2 gap-4 relative">
          <div className="flex flex-col items-center relative">
            <label className="mb-1" htmlFor="startMonth">Desde:</label>
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
                className="rounded-md p-1 w-36 text-center cursor-pointer pl-6"
                style={{ background:'#2D3748', color:'#F3F4F6', border:'1px solid #1F2937' }}
                onClick={(e) => e.target.showPicker && e.target.showPicker()}
              />
            </div>
          </div>
          <div className="flex flex-col items-center relative">
            <label className="mb-1" htmlFor="endMonth">Hasta:</label>
            <div>
              <input
                type="month"
                id="endMonth"
                value={endMonth}
                onChange={(e) => setEndMonth(e.target.value)}
                className="rounded-md p-1 w-36 text-center cursor-pointer pr-6"
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

      </div>
      <Line data={chartData} options={options} />
    </div>
  );
};

const generateColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default GraphComponent;
