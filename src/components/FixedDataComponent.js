import FinancialDropComponent from './FinancialDropComponent';
import { formatNumber } from '../utils/numbers';

const FixedDataComponent = ({ monthData }) => {
  const { date, income, fixedCost } = monthData;

  function getMonthName(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', { month: 'long' }).charAt(0).toUpperCase() + date.toLocaleString('es-ES', { month: 'long' }).slice(1);
  }

  function getCurrentMonthName() {
    const date = new Date();
    return date.toLocaleString('es-ES', { month: 'long' }).charAt(0).toUpperCase() + date.toLocaleString('es-ES', { month: 'long' }).slice(1);
  };

  const monthName = getMonthName(date);
  const currentMonthName = getCurrentMonthName()

  return (
    <div className={`w-60 bg-gray-800 rounded-lg p-4 shadow-lg text-center ${monthName === currentMonthName ? 'border-2 border-yellow-500' : ''}`}>
      <h3 className="font-bold text-2xl mb-4">{monthName}</h3>
      <label>Balance</label>
      <div>
        <label className='text-2xl text-blue-500 font-bold'>{formatNumber(income.total - fixedCost.total)}</label>
      </div>
      <FinancialDropComponent title="Ingresos" data={income} isIncome={true} />
      <FinancialDropComponent title="Egresos" data={fixedCost} isIncome={false} />
    </div>
  );
};

export default FixedDataComponent;
