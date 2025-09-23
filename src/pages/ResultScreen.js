import React, { useEffect, useState } from 'react';
import CarouselComponent from '../components/CarouselComponent';
import ButtonComponent from '../components/ButtonComponent';
import DropdownItemsPerPageComponent from '../components/DropdownItemsPerPageComponent';
import FixedDataComponent from '../components/FixedDataComponent';
import { getIncomes, patchIncome } from '../services/income';
import { getFixedCosts, patchFixedCost } from '../services/fixedCost';
import { getCardSpends, deleteCardSpend } from '../services/cardSpend';
import { adjustMonths } from '../utils/numbers';
import { parse, compareAsc } from 'date-fns';
import { getMonthlyData, handlePrev, handleNext, focusCurrentMonth } from '../utils/useMonthlyData';
import ConfirmDialog from '../components/ConfirmDialog';
import { useExchangeRate } from '../context/ExchangeRateContext';
import AddButtonComponent from '../components/AddButtonComponent';
import ExchangeRateDisplay from '../components/ExchangeRateDisplay';

const ResultScreen = () => {
  const { exchangeRate } = useExchangeRate();
  const [dataMonths, setDataMonths] = useState([]);
  const [itemsPerPages, setItemsPerPages] = useState(3);
  const [currentsMonths, setCurrentsMonths] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState({ open: false, message: '', onConfirm: null });

  const mergeData = (incomes, fixedCosts) => {
    const allMonths = [
      ...new Set([
        ...incomes.map((income) => income.date),
        ...fixedCosts.map((fixedCost) => fixedCost.date),
      ]),
    ];

    const mergedData = allMonths.map((month) => {
      const matchingIncome = incomes.find((incomeMonth) => incomeMonth.date === month);
      const matchingFixedCost = fixedCosts.find((fixedCostMonth) => fixedCostMonth.date === month);

      const income = matchingIncome || { income: [], total: 0 };
      const fixedCost = matchingFixedCost || { fixedCost: [], total: 0 };

      return {
        date: month,
        income: { items: income.income, total: income.total },
        fixedCost: { items: fixedCost.fixedCost, total: fixedCost.total },
      };
    });

    const filteredData = mergedData.filter(
      (month) => month.income.items.length > 0 || month.fixedCost.items.length > 0
    );

    filteredData.sort((a, b) => compareAsc(parse(a.date, 'yyyy-MM', new Date()), parse(b.date, 'yyyy-MM', new Date())));

    return filteredData;
  };

  const fetchAndMergeData = async () => {
    setLoading(true);
    try {
      const [incomes, fixedCosts, cardSpends] = await Promise.all([
        getIncomes(`?exchg_rate=${exchangeRate}`),
        getFixedCosts(`?exchg_rate=${exchangeRate}`),
        getCardSpends(),
      ]);

      const mergedData = mergeData(incomes, fixedCosts);
      const cardByDate = new Map(cardSpends.map(m => [m.date, m]));
      const withCard = mergedData.map(m => ({...m, cardMonth: cardByDate.get(m.date) || { total: 0, cardSpend: [] }}));
      setDataMonths(withCard);
      focusCurrentMonth(mergedData, setStartIndex, itemsPerPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndMergeData();
    const onDataUpdated = () => fetchAndMergeData();
    window.addEventListener('app:data-updated', onDataUpdated);
    return () => window.removeEventListener('app:data-updated', onDataUpdated);
  }, [exchangeRate]);

  useEffect(() => {
    setCurrentsMonths(getMonthlyData(dataMonths, startIndex, itemsPerPages));
  }, [dataMonths, startIndex, itemsPerPages]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPages(newItemsPerPage);
    focusCurrentMonth(dataMonths, setStartIndex, newItemsPerPage);
  };

  const handleDeleteFijos = async (data, monthName, type) => {
    const body = { ...data, date_to: adjustMonths(monthName, -1) };
    setConfirm({
      open: true,
      message: `¿Eliminar '${data.name}' a partir de ${monthName}?`,
      onConfirm: async () => {
        try {
          const patchFunction = type === 'fixedCost' ? patchFixedCost : patchIncome;
          await patchFunction(body);
          setConfirm({ open: false, message: '', onConfirm: null });
          fetchAndMergeData();
        } catch (error) {
          console.error(`Error patching ${type}:`, error);
          setConfirm({ open: false, message: '', onConfirm: null });
        }
      }
    });
  };

  const handleDeleteCardSpend = async (cardSpend) => {
    setConfirm({
      open: true,
      message: `¿Eliminar el gasto con tarjeta '${cardSpend.name || 'sin nombre'}'?`,
      onConfirm: async () => {
        try {
          await deleteCardSpend(cardSpend.id);
          setConfirm({ open: false, message: '', onConfirm: null });
          fetchAndMergeData();
        } catch (error) {
          console.error('Error deleting card spend:', error);
          setConfirm({ open: false, message: '', onConfirm: null });
        }
      }
    });
  };

  return (
    <div className="min-h-screen py-4" style={{ background: '#111827', color: '#F3F4F6' }}>
      <h1 className="text-center text-2xl font-bold tracking-tight">Saldos Mensuales</h1>
      <p className="italic text-center text-sm mb-6" style={{ color: '#9CA3AF' }}>¿Cuánto me queda cada mes?</p>
      <div className="relative p-1">
        <div className="text-center">
          <AddButtonComponent fromScreen="Ingreso" />
        </div>

        <CarouselComponent
          data={dataMonths}
          loading={loading}
          startIndex={startIndex}
          itemsPerPages={itemsPerPages}
          renderItem={(monthData) => (
            <FixedDataComponent
              monthData={monthData}
              onDeleteFijos={handleDeleteFijos}
              onDeleteCardSpend={handleDeleteCardSpend}
              cardMonth={monthData.cardMonth}
            />
          )}
        >
          <div className="flex justify-center top-[52px] z-10">
            <div className="flex justify-between items-center mt-4 w-[48rem] px-3 py-2 rounded-full border" style={{background:'#0F172A', borderColor:'#1F2937'}}>
              <ButtonComponent
                text={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6"><path fill="#F3F4F6" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                }
                ariaLabel="Anterior"
                onClick={() => setStartIndex(handlePrev(startIndex, itemsPerPages))}
                className="hover:bg-gray-700 rounded-full p-1 flex-shrink-0"
              />
              <div className="flex flex-grow justify-center items-center space-x-2">
                <div className="flex items-center rounded-full border overflow-hidden" style={{background:'#1F2937', borderColor:'#374151'}}>
                  <ButtonComponent
                    text="Actual"
                    ariaLabel="Ir al mes actual"
                    onClick={() => focusCurrentMonth(dataMonths, setStartIndex, itemsPerPages)}
                    className={`px-3 py-1 text-xs ${(
                      Array.isArray(currentsMonths) && currentsMonths.some(m => m.date === new Date().toISOString().slice(0,7))
                    ) ? 'text-[#D1D5DB]' : 'bg-teal-600 hover:bg-teal-500 text-white'}`}
                  />
                </div>
                <DropdownItemsPerPageComponent
                  itemsPerPage={itemsPerPages}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
                <ExchangeRateDisplay />
              </div>
              <ButtonComponent
                text={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6"><path fill="#F3F4F6" d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
                }
                ariaLabel="Siguiente"
                onClick={() => setStartIndex(handleNext(startIndex, itemsPerPages, dataMonths.length))}
                className="hover:bg-gray-700 rounded-full p-1 flex-shrink-0"
              />
            </div>
          </div>
        </CarouselComponent>
        <ConfirmDialog
          open={confirm.open}
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={()=> setConfirm({ open:false, message:'', onConfirm:null })}
        />
      </div>
    </div>
  );
};

export default ResultScreen;



