import React, { useEffect, useState } from 'react';
import CarouselComponent from '../components/CarouselComponent';
import ButtonComponent from '../components/ButtonComponent';
import DropdownItemsPerPageComponent from '../components/DropdownItemsPerPageComponent';
import CardDataComponent from '../components/CardDataComponent';
import { Link } from 'react-router-dom';
import mock from '../utils/months'

const FijosScreen = () => {
  const [dataMonths, setDataMonths] = useState([]);
  const [itemsPerPages, setItemsPerPages] = useState(3);
  const [currentsMonths, setCurrentsMonths] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  const setTreeMonths = () => {
    if (dataMonths) {
      return dataMonths.slice(startIndex, startIndex + itemsPerPages);
    }
    return [];
  };

  useEffect(() => {
    setDataMonths(mock);
  }, []);

  useEffect(() => {
    setCurrentsMonths(setTreeMonths());
  }, [dataMonths, startIndex, itemsPerPages]);

  const handlePrev = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - itemsPerPages, 0));
  };

  const handleNext = () => {
    setStartIndex((prevIndex) => {
      const newIndex = prevIndex + itemsPerPages;
      return newIndex >= dataMonths.length ? 0 : newIndex;
    });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPages(newItemsPerPage);
    setStartIndex(0);
  };

  return (
    <div className="dark bg-gray-900 text-white min-h-screen">
      <div className="relative p-4">
        <div className="flex justify-center items-center flex-wrap space-x-2">
          <ButtonComponent text="<" onClick={handlePrev} />
          <Link className="bg-blue-600 rounded-full px-4 py-2 hover:bg-blue-500" to="/agregar">+ Agregar</Link>
          <ButtonComponent text="Mes actual" />
          <DropdownItemsPerPageComponent itemsPerPage={itemsPerPages} onItemsPerPageChange={handleItemsPerPageChange} />
          <ButtonComponent text=">" onClick={handleNext} />
        </div>
        <CarouselComponent data={currentsMonths} renderItem={(monthData) => <CardDataComponent monthData={monthData} />} />
      </div>
    </div >
  );
};

export default FijosScreen;
