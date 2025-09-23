import FinancialDropComponent from './FinancialDropComponent';
import { formatPrice } from '../utils/numbers';

const SavingDataComponent = ({ monthData, onDeleteSaving, onPatchSaving, exRate }) => {

  const getMonthName = (dateStr) => {
    const month = parseInt(dateStr.split('-')[1], 10) - 1;
    const monthName = new Date(2024, month).toLocaleString('es-ES', { month: 'long' });
    return monthName.charAt(0).toUpperCase() + monthName.slice(1);
  };

  function isCurrentYearMonth(ym) {
    const current = new Date().toISOString().slice(0, 7);
    return ym === current;
  };

  const monthName = getMonthName(monthData.date);
  const currentMonth = isCurrentYearMonth(monthData.date)

  const monthLiquid = monthData.saving
    .filter((saving) => saving.liquid)
    .reduce((total, saving) => total + (saving.ccy == 'ARS' ? saving.obtained : saving.obtained * exRate), 0);

  return (
    <div className={`w-60 rounded-xl p-4 shadow-lg text-center ${currentMonth ? 'border border-teal-500' : 'border border-gray-700'}`} style={{background:'#1F2937', color:'#F3F4F6'}}>
      <h3 className="font-bold text-2xl mb-4">{monthName}</h3>
      <div className="mb-3">
        <label>Liquidez</label>
        <div>
          <label className='text-2xl font-bold' style={{color:'#14B8A6'}}>{formatPrice(monthLiquid, 'ARS')}</label>
        </div>
      </div>
      <FinancialDropComponent title="Total" data={monthData} isIncome={true} initialOpen={false} onDelete={(id) => onDeleteSaving(id)} onPatch={(id, data) => onPatchSaving(id, data, monthData.date)} />
    </div>
  );
};

export default SavingDataComponent;
