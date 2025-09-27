import { useExchangeRate } from '../context/ExchangeRateContext';

const ExchangeRateDisplay = () => {
  const { exchangeRate } = useExchangeRate();

  return (
    <div className="px-2 py-1 rounded-full border text-xs" style={{background:'#1F2937', color:'#D1D5DB', borderColor:'#374151'}}>
      <span className="uppercase tracking-wide mr-1" style={{color:'#9CA3AF'}}>USD</span>
      <span>{exchangeRate ? `$${exchangeRate.toLocaleString()}` : '...'}</span>
    </div>
  );
};

export default ExchangeRateDisplay;
