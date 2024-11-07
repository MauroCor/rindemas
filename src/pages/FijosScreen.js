import React, { useEffect, useState } from 'react';
import CarouselComponent from '../components/CarouselComponent';
import ButtonComponent from '../components/ButtonComponent';
import DropdownItemsPerPageComponent from '../components/DropdownItemsPerPageComponent';
import FixedDataComponent from '../components/FixedDataComponent';
import { Link } from 'react-router-dom';
import getIncomes from '../services/income';
import getFixedCosts from '../services/fixedCost';

const FijosScreen = () => {
  const [dataMonths, setDataMonths] = useState([]);
  const [itemsPerPages, setItemsPerPages] = useState(3);
  const [currentsMonths, setCurrentsMonths] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const fetchAndMergeData = async () => {
      try {
        const incomes = await getIncomes();
        const fixedCosts = await getFixedCosts();

        // Combine income and fixed costs by matching on the date
        const mergedData = incomes.map((incomeMonth) => {
          const matchingFixedCost = fixedCosts.find((cost) => cost.date === incomeMonth.date) || { fixedCost: [], total: 0 };
          
          return {
            date: incomeMonth.date,
            income: {
              items: incomeMonth.income,
              total: incomeMonth.total,
            },
            fixedCost: {
              items: matchingFixedCost.fixedCost,
              total: matchingFixedCost.total,
            },
          };
        });

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
    <div className="dark bg-gray-900 text-white min-h-screen">
      <div className="relative p-4">
        <div className="flex justify-center items-center flex-wrap space-x-2">
          <ButtonComponent text="<" onClick={handlePrev} />
          <Link className="bg-blue-600 rounded-full px-4 py-2 hover:bg-blue-500" to="/agregar">+ Agregar</Link>
          <ButtonComponent text="Centrar" onClick={focusCurrentMonth} />
          <DropdownItemsPerPageComponent itemsPerPage={itemsPerPages} onItemsPerPageChange={handleItemsPerPageChange} />
          <ButtonComponent text=">" onClick={handleNext} />
        </div>
        <CarouselComponent data={currentsMonths} renderItem={(monthData) => <FixedDataComponent monthData={monthData} />} />
      </div>
    </div>
  );
};

export default FijosScreen;
