import FinancialDropComponent from './FinancialDropComponent';
import { formatNumber } from '../utils/numbers';

const FixedDataComponent = ({ monthData, onDeleteFijos }) => {
  const { date, income, fixedCost } = monthData;

  const getMonthName = (dateStr) => {
    const month = parseInt(dateStr.split('-')[1], 10) - 1;
    const monthName = new Date(2024, month).toLocaleString('es-ES', { month: 'long' });
    return monthName.charAt(0).toUpperCase() + monthName.slice(1);
  };

  function getCurrentMonthName() {
    const date = new Date();
    return date.toLocaleString('es-ES', { month: 'long' }).charAt(0).toUpperCase() + date.toLocaleString('es-ES', { month: 'long' }).slice(1);
  };

  const monthName = getMonthName(date);
  const currentMonthName = getCurrentMonthName()

  return (
    <div className={`w-60 bg-gray-800 rounded-lg p-4 shadow-lg text-center ${monthName === currentMonthName ? 'border-2 border-yellow-500' : ''}`}>
      <h3 className="font-bold text-2xl mb-4 text-white">{monthName}</h3>
      <label className='text-white'>Balance</label>
      <div>
        <label className='text-2xl text-blue-500 font-bold'>{formatNumber(income.total - fixedCost.total)}</label>
      </div>
      <FinancialDropComponent title="Ingresos" data={income} isIncome={true} onDelete={(data) => onDeleteFijos(data, date, 'income')}/>
      <FinancialDropComponent title="Egresos" data={fixedCost} isIncome={false} onDelete={(data) => onDeleteFijos(data, date, 'fixedCost')} />
    </div>
  );
};

export default FixedDataComponent;
