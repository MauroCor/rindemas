import React, { useEffect, useState } from 'react';
import CarouselComponent from '../components/CarouselComponent';
import ButtonComponent from '../components/ButtonComponent';
import DropdownItemsPerPageComponent from '../components/DropdownItemsPerPageComponent';
import SavingDataComponent from '../components/SavingDataComponent';
import { getSavings, deleteSaving, patchSaving } from '../services/saving';
import GraphComponent from '../components/GraphComponent';
import { adjustMonths } from '../utils/numbers';
import { getMonthlyData, handlePrev, handleNext, focusCurrentMonth } from '../utils/useMonthlyData';
import { useExchangeRate } from '../context/ExchangeRateContext';
import AddButtonComponent from '../components/AddButtonComponent';
import ExchangeRateDisplay from '../components/ExchangeRateDisplay';
import PieChartComponent from '../components/PieChartCcyComponent';

const SavingScreen = () => {
    const { exchangeRate } = useExchangeRate();
    const [dataMonths, setDataMonths] = useState([]);
    const [itemsPerPages, setItemsPerPages] = useState(3);
    const [currentsMonths, setCurrentsMonths] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                if (exchangeRate != '') {
                    const savings = await getSavings(`?exchg_rate=${exchangeRate}`);
                    setDataMonths(savings);
                    focusCurrentMonth(savings, setStartIndex, itemsPerPages);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [exchangeRate]);

    useEffect(() => {
        setCurrentsMonths(getMonthlyData(dataMonths, startIndex, itemsPerPages));
    }, [dataMonths, startIndex, itemsPerPages]);

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPages(newItemsPerPage);
        focusCurrentMonth(dataMonths, setStartIndex, newItemsPerPage);
    };

    const handleDeleteSaving = async (id) => {
        const isConfirmed = window.confirm(`¿Quiere eliminar el ahorro completamente?`);

        if (isConfirmed) {
            try {
                await deleteSaving(id);
                setDataMonths((prevData) =>
                    prevData.map((month) => ({
                        ...month,
                        saving: month.saving.filter((item) => item.id !== id),
                    }))
                );
                setDataMonths((prevData) => prevData.filter((month) => month.saving.length > 0));
            } catch (error) {
                console.error('Error deleting saving:', error);
            }
        }
    };

    const handlePatchSaving = async (id, data, date) => {
        const body = { ...data, date_to: adjustMonths(date, -1) };
        const isConfirmed = window.confirm(`¿Quiere finalizar '${data.name}' a partir del ${date}?`);

        if (isConfirmed) {
            try {
                await patchSaving(id, body);
                const updatedData = await getSavings(`?exchg_rate=${exchangeRate}`);
                setDataMonths(updatedData);
            } catch (error) {
                console.error('Error patching saving:', error);
            }
        }
    };

    return (
        <div className="min-h-screen py-4" style={{background:'#111827', color:'#F3F4F6'}}>
            <h1 className="text-center text-2xl font-bold tracking-tight">Ahorros Invertidos</h1>
            <p className="italic text-center text-sm mb-6" style={{color:'#9CA3AF'}}>¿Cuánto crecen mis ahorros?</p>
            <div className="relative p-1">
                <div className="text-center">
                    <AddButtonComponent fromScreen="Ahorro" />
                </div>

                <CarouselComponent
                    data={dataMonths}
                    loading={loading}
                    startIndex={startIndex}
                    itemsPerPages={itemsPerPages}
                    renderItem={(monthData) => (
                        <SavingDataComponent
                            monthData={monthData}
                            onDeleteSaving={handleDeleteSaving}
                            onPatchSaving={handlePatchSaving}
                            exRate={exchangeRate}
                        />
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

            <div className="pt-10 text-center max-w-screen-sm mx-auto">
                <GraphComponent data={dataMonths} />
            </div>

            <div className="pt-10 text-center max-w-screen-sm mx-auto">
                <PieChartComponent title="Diversificación del Portafolio" data={dataMonths} />
            </div>
        </div>
    );
};

export default SavingScreen;
