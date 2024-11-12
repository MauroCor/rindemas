import FinancialDropComponent from './FinancialDropComponent';

const CardDataComponent = ({ monthData, onDeleteCardSpend}) => {

  function getMonthName(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', { month: 'long' }).charAt(0).toUpperCase() + date.toLocaleString('es-ES', { month: 'long' }).slice(1);
  }

  function getCurrentMonthName() {
    const date = new Date();
    return date.toLocaleString('es-ES', { month: 'long' }).charAt(0).toUpperCase() + date.toLocaleString('es-ES', { month: 'long' }).slice(1);
  };

  const monthName = getMonthName(monthData.date);
  const currentMonthName = getCurrentMonthName()

  return (
    <div className={`w-60 bg-gray-800 rounded-lg p-4 shadow-lg text-center ${monthName === currentMonthName ? 'border-2 border-yellow-500' : ''}`}>
      <h3 className="font-bold text-2xl mb-4">{monthName}</h3>
      <FinancialDropComponent title="Total" data={monthData} isIncome={false} initialOpen onDelete={(id) => onDeleteCardSpend(id)} />
    </div>
  );
};

export default CardDataComponent;
