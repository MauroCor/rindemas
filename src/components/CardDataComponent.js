import FinancialDropComponent from './FinancialDropComponent';
import { getMonthName, isCurrentYearMonth } from '../utils/dateUtils';
import { getCardClassName, getCardStyle } from '../utils/styles';

const CardDataComponent = ({ monthData, onDeleteCardSpend}) => {
  const monthName = getMonthName(monthData.date);
  const currentMonth = isCurrentYearMonth(monthData.date);
  
  return (
    <div className={getCardClassName(currentMonth)} style={getCardStyle()}>
      <h3 className="font-bold text-2xl mb-4">{monthName}</h3>
      <FinancialDropComponent title="Total" data={monthData} isIncome={false} initialOpen onDelete={(id) => onDeleteCardSpend(id)} />
    </div>
  );
};

export default CardDataComponent;
