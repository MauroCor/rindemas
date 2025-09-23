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

const GraphComponent = ({ data, showAverage = false, showSavings = false, graphMode, onChangeGraphMode }) => {
  const [startMonth, setStartMonth] = useState('');
  const [endMonth, setEndMonth] = useState('');

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
    if (!startMonth || !endMonth) return true;
    return item.date >= startMonth && item.date <= endMonth;
  });

  if (filteredData.length === 0) {
    return;
  }

  const labels = filteredData.map((item) => item.date);
  const totals = filteredData.map((item) => Number(item.total) || 0);
  const average = totals.reduce((acc, val) => acc + val, 0) / (totals.length || 1);

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

  const datasets = [
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
  ];
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative">
          <div className="flex flex-col items-center relative">
            <label className="mb-1" style={{color:'#D1D5DB'}}>Graficar:</label>
            <select
              className="bg-gray-800 text-white rounded px-3 py-1 border"
              style={{background:'#2D3748',borderColor:'#374151'}}
              value={graphMode}
              onChange={(e) => onChangeGraphMode && onChangeGraphMode(e.target.value)}
            >
              <option value="total+avg">Total</option>
              <option value="todo">Todo</option>
            </select>
          </div>
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

      </div>
      <div style={{height: '300px'}}>
        <Line data={chartData} options={options} />
      </div>
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
