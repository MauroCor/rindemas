import FinancialDropComponent from './FinancialDropComponent';

const CardDataComponent = ({ monthData }) => {

  function getMonthName(dateString) {
    const date = new Date(dateString);
    const month = date.toLocaleString('es-ES', { month: 'long' });
    return month.charAt(0).toUpperCase() + month.slice(1);
  }

  function getCurrentMonthName() {
    const date = new Date();
    return date.toLocaleString('es-ES', { month: 'long' }).charAt(0).toUpperCase() + date.toLocaleString('es-ES', { month: 'long' }).slice(1);
  }

  const monthName = getMonthName(monthData.date);

  const currentMonthName = getCurrentMonthName();

  return (
    <div className={`w-60 bg-gray-800 rounded-lg p-4 shadow-lg text-center ${monthName === currentMonthName ? 'border-2 border-yellow-500' : ''}`}>
      <h3 className="font-bold text-2xl mb-4">{monthName}</h3>
      <FinancialDropComponent title="Total" amount="400" isOpen />
    </div>
  );
};

export default CardDataComponent;
