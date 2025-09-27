import FinancialDropComponent from './FinancialDropComponent';
import { formatPrice } from '../utils/numbers';
import { getMonthName, isCurrentYearMonth } from '../utils/dateUtils';
import { getCardClassName, getCardStyle, TEXT_COLORS } from '../utils/styles';

const FixedDataComponent = ({ monthData, onDeleteFijos, onDeleteCardSpend, cardMonth }) => {
  const { date, income, fixedCost } = monthData;
  const monthName = getMonthName(date);
  const currentMonth = isCurrentYearMonth(date);

  return (
    <div className={getCardClassName(currentMonth)} style={getCardStyle()}>
      <h3 className="font-bold text-2xl mb-4">{monthName}</h3>
      <label>Saldo</label>
      <div>
        <label className='text-2xl font-bold' style={{color: TEXT_COLORS.accent}}>{formatPrice(income.total - fixedCost.total, 'ARS')}</label>
      </div>
      <FinancialDropComponent title="Ingresos" data={income} isIncome={true} onDelete={(data) => onDeleteFijos(data, date, 'income')}/>
      <FinancialDropComponent title="Egresos" data={{...fixedCost, items: fixedCost.items.filter(i => i.name !== 'Tarjeta'), total: fixedCost.items.filter(i => i.name !== 'Tarjeta').reduce((s,i)=> s + i.price, 0)}} isIncome={false} onDelete={(data) => onDeleteFijos(data, date, 'fixedCost')} />
      {cardMonth && (
        <FinancialDropComponent title="Tarjeta" data={cardMonth} isIncome={false} initialOpen={false} onDelete={onDeleteCardSpend} />
      )}
    </div>
  );
};

export default FixedDataComponent;
