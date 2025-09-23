import FinancialDropComponent from './FinancialDropComponent';
import { formatPrice } from '../utils/numbers';

const FixedDataComponent = ({ monthData, onDeleteFijos, onDeleteCardSpend, cardMonth }) => {
  const { date, income, fixedCost } = monthData;

  const getMonthName = (dateStr) => {
    const month = parseInt(dateStr.split('-')[1], 10) - 1;
    const monthName = new Date(2024, month).toLocaleString('es-ES', { month: 'long' });
    return monthName.charAt(0).toUpperCase() + monthName.slice(1);
  };

  function isCurrentYearMonth(ym) {
    const current = new Date().toISOString().slice(0, 7);
    return ym === current;
  };

  const monthName = getMonthName(date);
  const currentMonth = isCurrentYearMonth(date);

  // cardMonth ahora viene inyectado desde la pantalla padre para evitar fetch por tarjeta

  return (
    <div className={`w-60 rounded-xl p-4 shadow-lg text-center ${currentMonth ? 'border border-teal-500' : 'border border-gray-700'}`} style={{background:'#1F2937', color:'#F3F4F6'}}>
      <h3 className="font-bold text-2xl mb-4">{monthName}</h3>
      <label>Saldo</label>
      <div>
        <label className='text-2xl font-bold' style={{color:'#14B8A6'}}>{formatPrice(income.total - fixedCost.total, 'ARS')}</label>
      </div>
      <FinancialDropComponent title="Ingresos" data={income} isIncome={true} onDelete={(data) => onDeleteFijos(data, date, 'income')}/>
      {/* Egresos sin Tarjeta como fijo bloqueado */}
      <FinancialDropComponent title="Egresos" data={{...fixedCost, items: fixedCost.items.filter(i => i.name !== 'Tarjeta'), total: fixedCost.items.filter(i => i.name !== 'Tarjeta').reduce((s,i)=> s + i.price, 0)}} isIncome={false} onDelete={(data) => onDeleteFijos(data, date, 'fixedCost')} />
      {/* Tarjeta como sección separada con detalle */}
      {cardMonth && (
        <FinancialDropComponent title="Tarjeta" data={cardMonth} isIncome={false} initialOpen={false} onDelete={onDeleteCardSpend} />
      )}
    </div>
  );
};

export default FixedDataComponent;
