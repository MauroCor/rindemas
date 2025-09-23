import FinancialDropComponent from './FinancialDropComponent';

const CardDataComponent = ({ monthData, onDeleteCardSpend}) => {

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
  
  return (
    <div className={`w-60 rounded-xl p-4 shadow-lg text-center ${currentMonth ? 'border border-teal-500' : 'border border-gray-700'}`} style={{background:'#1F2937', color:'#F3F4F6'}}>
      <h3 className="font-bold text-2xl mb-4">{monthName}</h3>
      <FinancialDropComponent title="Total" data={monthData} isIncome={false} initialOpen onDelete={(id) => onDeleteCardSpend(id)} />
    </div>
  );
};

export default CardDataComponent;
