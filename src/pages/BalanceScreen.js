import React, { useEffect, useState } from 'react';
import CarouselComponent from '../components/CarouselComponent';
import ButtonComponent from '../components/ButtonComponent';
import DropdownItemsPerPageComponent from '../components/DropdownItemsPerPageComponent';
import FinancialDropComponent from '../components/FinancialDropComponent';
import ExchangeRateDisplay from '../components/ExchangeRateDisplay';
import { getIncomes } from '../services/income';
import { getFixedCosts } from '../services/fixedCost';
import { getSavings } from '../services/saving';
import { parse, compareAsc } from 'date-fns';
import { getMonthlyData, handlePrev, handleNext, focusCurrentMonth } from '../utils/useMonthlyData';
import { useExchangeRate } from '../context/ExchangeRateContext';
import AddButtonComponent from '../components/AddButtonComponent';
import { formatPrice } from '../utils/numbers';

const BalanceScreen = () => {
  const { exchangeRate } = useExchangeRate();
  const [dataMonths, setDataMonths] = useState([]);
  const [itemsPerPages, setItemsPerPages] = useState(3);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const getMonthName = (dateStr) => {
    const [year, month] = dateStr.split('-').map(Number);
    const monthName = new Date(year, month - 1).toLocaleString('es-ES', { month: 'long' });
    return monthName.charAt(0).toUpperCase() + monthName.slice(1);
  };

  const isCurrentYearMonth = (ym) => new Date().toISOString().slice(0, 7) === ym;

  const mergeSummary = (incomes, fixedCosts, savings, exRate) => {
    const byIncome = new Map(incomes.map(m => [m.date, m]));
    const byFixed = new Map(fixedCosts.map(m => [m.date, m]));
    const bySave = new Map(savings.map(m => [m.date, m]));

    const allMonths = Array.from(new Set([...byIncome.keys(), ...byFixed.keys(), ...bySave.keys()]));

    const merged = allMonths.map((month) => {
      const inc = byIncome.get(month) || { total: 0 };
      const fix = byFixed.get(month) || { total: 0 };
      const sav = bySave.get(month) || { total: 0, saving: [] };

      const balanceItems = [
        { name: 'Ingresos', ccy: 'ARS', amount: null, price: inc.total },
        { name: 'Egresos', ccy: 'ARS', amount: null, price: fix.total },
      ];

      const liquidItems = (sav.saving || []).filter((s) => s.liquid);
      const liquidTotal = liquidItems.reduce((acc, s) => {
        const val = s.obtained || 0;
        return acc + (s.ccy === 'ARS' ? val : val * (exRate || 0));
      }, 0);

      return {
        date: month,
        balance: { items: balanceItems, total: inc.total - fix.total },
        liquidez: { saving: liquidItems, total: liquidTotal },
      };
    });

    merged.sort((a, b) => compareAsc(parse(a.date, 'yyyy-MM', new Date()), parse(b.date, 'yyyy-MM', new Date())));
    return merged;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [incomes, fixedCosts, savings] = await Promise.all([
          getIncomes(`?exchg_rate=${exchangeRate}`),
          getFixedCosts(`?exchg_rate=${exchangeRate}`),
          getSavings(`?exchg_rate=${exchangeRate}`),
        ]);
        const merged = mergeSummary(incomes, fixedCosts, savings, exchangeRate);
        setDataMonths(merged);
        focusCurrentMonth(merged, setStartIndex, itemsPerPages);
      } catch (e) {
        console.error('Error loading summary:', e);
      } finally {
        setLoading(false);
      }
    };
    if (exchangeRate !== '') fetchData();
  }, [exchangeRate, itemsPerPages]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPages(newItemsPerPage);
    focusCurrentMonth(dataMonths, setStartIndex, newItemsPerPage);
  };

  return (
    <div className="min-h-screen py-4" style={{background:'#111827', color:'#F3F4F6'}}>
      <h1 className="text-center text-2xl font-bold tracking-tight">Balance General</h1>
      <p className="italic text-center text-sm mb-6" style={{color:'#9CA3AF'}}>¿Cuánto dinero dispongo?</p>
      <div className="text-center mb-2"><AddButtonComponent fromScreen="Ingreso" /></div>

      <CarouselComponent
        data={dataMonths}
        loading={loading}
        startIndex={startIndex}
        itemsPerPages={itemsPerPages}
        renderItem={(monthData) => (
          <div className={`w-60 rounded-xl p-4 shadow-lg text-center border ${isCurrentYearMonth(monthData.date) ? 'border-teal-500' : 'border-gray-700'}`} style={{background:'#1F2937'}}>
            <h3 className="font-bold text-2xl mb-4">{getMonthName(monthData.date)}</h3>
            <div className="mb-3">
              <label>Balance</label>
              <div>
                <label className='text-2xl font-bold' style={{color:'#14B8A6'}}>{formatPrice((monthData.balance?.total || 0) + (monthData.liquidez?.total || 0), 'ARS')}</label>
              </div>
            </div>
            <FinancialDropComponent title="Saldo" data={monthData.balance} isIncome={true} initialOpen={false} onDelete={()=>{}} />
            <FinancialDropComponent title="Liquidez" data={monthData.liquidez} isIncome={true} initialOpen={false} onDelete={()=>{}} />
          </div>
        )}
      >
        <div className="flex justify-center sticky top-[52px] z-10" style={{background:'#111827'}}>
          <div className="flex justify-between items-center mt-4 w-[48rem]">
            <ButtonComponent
              text="⬅️"
              onClick={() => setStartIndex(handlePrev(startIndex, itemsPerPages))}
              className="hover:bg-gray-700 text-2xl rounded-full px-3 py-1 flex-shrink-0"
            />
            <div className="flex flex-grow justify-center items-center space-x-2">
              <ButtonComponent
                text="Actual"
                onClick={() => focusCurrentMonth(dataMonths, setStartIndex, itemsPerPages)}
                className="bg-teal-600 hover:bg-teal-500 px-2 rounded text-white"
              />
              <DropdownItemsPerPageComponent
                itemsPerPage={itemsPerPages}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
              <ExchangeRateDisplay />
            </div>
            <ButtonComponent
              text="➡️"
              onClick={() => setStartIndex(handleNext(startIndex, itemsPerPages, dataMonths.length))}
              className="hover:bg-gray-700 text-2xl rounded-full px-3 py-1 flex-shrink-0"
            />
          </div>
        </div>
      </CarouselComponent>
    </div>
  );
};

export default BalanceScreen;


