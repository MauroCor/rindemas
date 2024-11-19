import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CarouselComponent from '../components/CarouselComponent';
import ButtonComponent from '../components/ButtonComponent';
import DropdownItemsPerPageComponent from '../components/DropdownItemsPerPageComponent';
import SavingDataComponent from '../components/SavingDataComponent';
// import getSavings from '../services/saving';
// import { deleteSaving } from '../services/saving';
import { saving } from '../utils/saving';
import GraphComponent from '../components/GraphComponent';


const SavingScreen = () => {
    const [dataMonths, setDataMonths] = useState([]);
    const [itemsPerPages, setItemsPerPages] = useState(3);
    const [currentsMonths, setCurrentsMonths] = useState([]);

    const focusCurrentMonth = () => {
        const currentDate = new Date();
        const currentIndex = dataMonths.findIndex((month) => {
            const monthDate = new Date(month.date);
            return monthDate.getFullYear() === currentDate.getFullYear() && monthDate.getMonth() === currentDate.getMonth();
        });

        if (currentIndex !== -1) {
            setStartIndex(currentIndex - 1);
        }
    };

    const [startIndex, setStartIndex] = useState(focusCurrentMonth);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const savings = await getSavings();
                const savings = saving;
                setDataMonths(savings);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        setCurrentsMonths(dataMonths.slice(startIndex, startIndex + itemsPerPages));
    }, [dataMonths, startIndex, itemsPerPages]);

    useEffect(() => {
        focusCurrentMonth();
    }, [dataMonths]);

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

    const handleDeleteSaving = async (id) => {
        const isConfirmed = window.confirm(`¿Quiere eliminar el ahorro completamente?`);

        if (isConfirmed) {
            try {
                // await deleteSaving(id);
                const a = 1;
                // setDataMonths((prevData) =>
                //     prevData.map((month) => ({
                //         ...month,
                //         saving: month.saving.filter((item) => item.id !== id),
                //     }))
                // );
            } catch (error) {
                console.error('Error deleting saving:', error);
            }
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
                <CarouselComponent data={currentsMonths} renderItem={(monthData) => <SavingDataComponent monthData={monthData} onDeleteCardSpend={handleDeleteSaving} />} />
            </div>
            <div className="pt-10 text-center max-w-screen-sm mx-auto">
                <GraphComponent data={saving} />
            </div>

        </div>
    );
};

export default SavingScreen;
