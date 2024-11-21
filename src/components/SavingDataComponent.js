import FinancialDropComponent from './FinancialDropComponent';
import { formatNumber } from '../utils/numbers';

const CardDataComponent = ({ monthData, onDeleteSaving }) => {

  const getMonthName = (dateStr) => {
    const month = parseInt(dateStr.split('-')[1], 10) - 1;
    const monthName = new Date(2024, month).toLocaleString('es-ES', { month: 'long' });
    return monthName.charAt(0).toUpperCase() + monthName.slice(1);
  };

  function getCurrentMonthName() {
    const date = new Date();
    return date.toLocaleString('es-ES', { month: 'long' }).charAt(0).toUpperCase() + date.toLocaleString('es-ES', { month: 'long' }).slice(1);
  };

  const monthName = getMonthName(monthData.date);
  const currentMonthName = getCurrentMonthName()

  const monthLiquid = monthData.saving
    .filter((saving) => saving.liquid)
    .reduce((total, saving) => total + saving.obtained, 0); 

  return (
    <div className={`w-60 bg-gray-800 rounded-lg p-4 shadow-lg text-center ${monthName === currentMonthName ? 'border-2 border-yellow-500' : ''}`}>
      <h3 className="font-bold text-2xl mb-4 text-white">{monthName}</h3>
      <FinancialDropComponent title="Total" data={monthData} isIncome={true} initialOpen onDelete={(id) => onDeleteSaving(id)} />
      <p className="text-white text-sm">💰 Liquidez: <span className='font-bold text-white text-base'>{formatNumber(monthLiquid)}</span></p>
    </div>
  );
};

export default CardDataComponent;
