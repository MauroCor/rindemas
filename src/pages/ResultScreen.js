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
    const isConfirmed = window.confirm(`¿Quiere eliminar '${data.name}' a partir de ${monthName}?`);

    if (isConfirmed) {
      try {
        const patchFunction = type === 'fixedCost' ? patchFixedCost : patchIncome;
        await patchFunction(body);
        fetchAndMergeData();
      } catch (error) {
        console.error(`Error patching ${type}:`, error);
      }
    }
  };

  const handleDeleteCardSpend = async (cardSpend) => {
    const isConfirmed = window.confirm(`¿Quiere eliminar el gasto '${cardSpend.name || 'sin nombre'}'?`);

    if (isConfirmed) {
      try {
        await deleteCardSpend(cardSpend.id);
        fetchAndMergeData();
      } catch (error) {
        console.error('Error deleting card spend:', error);
      }
    }
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
          <div className="flex justify-center sticky top-[52px] z-10" style={{ background: '#111827' }}>
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
    </div>
  );
};

export default ResultScreen;


