import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CarouselComponent from '../components/CarouselComponent';
import ButtonComponent from '../components/ButtonComponent';
import DropdownItemsPerPageComponent from '../components/DropdownItemsPerPageComponent';
import CardDataComponent from '../components/CardDataComponent';
import getCardSpends from '../services/cardSpend';
import { deleteCardSpend } from '../services/cardSpend';

const SaveScreen = () => {
//     const [dataMonths, setDataMonths] = useState([]);
//     const [itemsPerPages, setItemsPerPages] = useState(3);
//     const [currentsMonths, setCurrentsMonths] = useState([]);
//     const [startIndex, setStartIndex] = useState(0);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const cardSpends = await getCardSpends();
//                 setDataMonths(cardSpends);
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//             }
//         };

//         fetchData();
//     }, []);

//     useEffect(() => {
//         setCurrentsMonths(dataMonths.slice(startIndex, startIndex + itemsPerPages));
//     }, [dataMonths, startIndex, itemsPerPages]);

//     const handlePrev = () => {
//         setStartIndex((prevIndex) => Math.max(prevIndex - itemsPerPages, 0));
//     };

//     const handleNext = () => {
//         setStartIndex((prevIndex) => {
//             const newIndex = prevIndex + itemsPerPages;
//             return newIndex >= dataMonths.length ? Math.max(0, dataMonths.length - itemsPerPages) : newIndex;
//         });
//     };

//     const handleItemsPerPageChange = (newItemsPerPage) => {
//         setItemsPerPages(newItemsPerPage);
//         setStartIndex(0);
//     };

//     const focusCurrentMonth = () => {
//         const currentDate = new Date();
//         const currentMonth = currentDate.getMonth();
//         const currentYear = currentDate.getFullYear();

//         const currentIndex = dataMonths.findIndex((month) => {
//             const monthDate = new Date(month.date);
//             return monthDate.getFullYear() === currentYear && monthDate.getMonth() === currentMonth;
//         });

//         if (currentIndex !== -1) {
//             const adjustedIndex = Math.floor(currentIndex / itemsPerPages) * itemsPerPages;
//             setStartIndex(adjustedIndex);
//         }
//     };

//     const handleDeleteCardSpend = async (id) => {
//         const isConfirmed = window.confirm(`¿Quiere eliminar el gasto de tarjeta completamente?`);

//         if (isConfirmed) {
//             try {
//                 await deleteCardSpend(id);

//                 setDataMonths((prevData) =>
//                     prevData.map((month) => ({
//                         ...month,
//                         cardSpend: month.cardSpend.filter((item) => item.id !== id),
//                     }))
//                 );
//             } catch (error) {
//                 console.error('Error deleteCardSpend:', error);
//             }
//         }
//     };

    return (
        <div className="dark bg-gray-900 min-h-screen py-8">
            <h1 className='text-3xl text-center text-white'>Muy pronto...</h1>
            {/* <div className="relative p-1">
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
                <CarouselComponent data={currentsMonths} renderItem={(monthData) => <CardDataComponent monthData={monthData} onDeleteCardSpend={handleDeleteCardSpend} />} />
            </div> */}
        </div>
    );
};

export default SaveScreen;
