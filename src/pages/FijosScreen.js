import React, { useEffect, useState } from 'react';
import CarouselComponent from '../components/CarouselComponent';
import ButtonComponent from '../components/ButtonComponent';
import DropdownItemsPerPageComponent from '../components/DropdownItemsPerPageComponent';
import FixedDataComponent from '../components/FixedDataComponent';
import { Link } from 'react-router-dom';
import { getIncomes, patchIncome } from '../services/income';
import { getFixedCosts, patchFixedCost } from '../services/fixedCost';
import { subtractMonths } from '../utils/numbers';

const FijosScreen = () => {
  const [dataMonths, setDataMonths] = useState([]);
  const [itemsPerPages, setItemsPerPages] = useState(3);
  const [currentsMonths, setCurrentsMonths] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  const mergeData = (incomes, fixedCosts) => {
    // Combina ingresos y egresos para los meses, asegurando que si solo hay egresos, se muestren también
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

    // Filtrar los meses que tienen ingresos o egresos
    const filteredData = mergedData.filter(
      (month) => month.income.items.length > 0 || month.fixedCost.items.length > 0
    );

    // Ordenar los datos por mes (formato YYYY-MM)
    filteredData.sort((a, b) => (a.date > b.date ? 1 : -1));

    return filteredData;
  };

  useEffect(() => {
    const fetchAndMergeData = async () => {
      try {
        const incomes = await getIncomes();
        const fixedCosts = await getFixedCosts();

        // Utilizar la función mergeData para combinar y ordenar los datos
        const mergedData = mergeData(incomes, fixedCosts);

        // Establecer los datos en el estado
        setDataMonths(mergedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAndMergeData();
  }, []);

  useEffect(() => {
    setCurrentsMonths(dataMonths.slice(startIndex, startIndex + itemsPerPages));
  }, [dataMonths, startIndex, itemsPerPages]);

  const handlePrev = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - itemsPerPages, 0));
  };

  const handleNext = () => {
    setStartIndex((prevIndex) => {
      const newIndex = prevIndex + itemsPerPages;
      return newIndex >= dataMonths.length ? Math.max(0, dataMonths.length - itemsPerPages) : newIndex;
    });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPages(newItemsPerPage);
    setStartIndex(0);
  };

  const handleDeleteFijos = async (data, monthName, type) => {
    const body = { ...data, date_to: subtractMonths(monthName, 1) };
    const isConfirmed = window.confirm(`¿Quiere eliminar '${data.name}' a partir de ${monthName}?`);

    if (isConfirmed) {
      try {
        const patchFunction = type === 'fixedCost' ? patchFixedCost : patchIncome;
        await patchFunction(body);

        const [incomes, fixedCosts] = await Promise.all([getIncomes(), getFixedCosts()]);

        const mergedData = mergeData(incomes, fixedCosts);

        setDataMonths(mergedData);
      } catch (error) {
        console.error(`Error patching ${type}:`, error);
      }
    }
  };

  const focusCurrentMonth = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const currentIndex = dataMonths.findIndex((month) => {
      const monthDate = new Date(month.date);
      return monthDate.getFullYear() === currentYear && monthDate.getMonth() === currentMonth;
    });

    if (currentIndex !== -1) {
      const adjustedIndex = Math.floor(currentIndex / itemsPerPages) * itemsPerPages;
      setStartIndex(adjustedIndex);
    }
  };

  return (
    <div className="dark bg-gray-900 min-h-screen py-8">
      <div className="relative p-1">
        <div className="text-center">
          <Link className="text-white bg-gradient-to-br from-[#4b76c8] to-[#1f4691] rounded-[45px] text-[15px] p-[10px] border-4 border-[#252525] shadow-[ -6px_-5px_18px_rgba(255,255,255,0.1)] cursor-pointer" to="/agregar">+ Agregar</Link>
        </div>
        <div className='flex justify-center items-center flex-wrap space-x-2 mt-6'>
          <ButtonComponent text="⬅️" onClick={handlePrev} className='hover:bg-blue-500 text-2xl rounded-full px-1 py-1' />
          <div className='pl-10' />
          <ButtonComponent text="Ver actual" onClick={focusCurrentMonth} className='hover:bg-blue-500 bg-gray-600 px-2 py-0 border-gray-950 text-white' />
          <DropdownItemsPerPageComponent itemsPerPage={itemsPerPages} onItemsPerPageChange={handleItemsPerPageChange} />
          <div className='pl-10' />
          <ButtonComponent text="➡️" onClick={handleNext} className='hover:bg-blue-500 text-2xl rounded-full px-1 py-1' />
        </div>
        <CarouselComponent data={currentsMonths} renderItem={(monthData) => <FixedDataComponent monthData={monthData} onDeleteFijos={handleDeleteFijos} />} />
      </div>
    </div>
  );
};

export default FijosScreen;
