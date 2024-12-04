import React, { useEffect, useState } from 'react';
import CarouselComponent from '../components/CarouselComponent';
import ButtonComponent from '../components/ButtonComponent';
import DropdownItemsPerPageComponent from '../components/DropdownItemsPerPageComponent';
import CardDataComponent from '../components/CardDataComponent';
import { getCardSpends } from '../services/cardSpend';
import { deleteCardSpend } from '../services/cardSpend';
import { getMonthlyData, handlePrev, handleNext, focusCurrentMonth } from '../utils/useMonthlyData';
import AddButtonComponent from '../components/AddButtonComponent';

const CardScreen = () => {
    const [dataMonths, setDataMonths] = useState([]);
    const [itemsPerPages, setItemsPerPages] = useState(3);
    const [currentsMonths, setCurrentsMonths] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const cardSpends = await getCardSpends();
                setDataMonths(cardSpends);
                focusCurrentMonth(dataMonths, setStartIndex);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        setCurrentsMonths(getMonthlyData(dataMonths, startIndex, itemsPerPages));
    }, [dataMonths, startIndex, itemsPerPages]);

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPages(newItemsPerPage);
        setStartIndex(0);
    };

    const handleDeleteCardSpend = async (id) => {
        const isConfirmed = window.confirm(`¿Quiere eliminar el gasto de tarjeta completamente?`);

        if (isConfirmed) {
            try {
                await deleteCardSpend(id);

                setDataMonths((prevData) =>
                    prevData.map((month) => ({
                        ...month,
                        cardSpend: month.cardSpend.filter((item) => item.id !== id),
                    })).filter((month) => month.cardSpend.length > 0)
                );
            } catch (error) {
                console.error('Error deleteCardSpend:', error);
            }
        }
    };

    return (
        <div className="dark bg-gray-900 min-h-screen py-4">
            <h1 className="text-center text-2xl font-bold text-white tracking-tight">Gastos de Tarjeta</h1>
            <p className="italic text-center text-sm text-blue-200 mb-6">- Compras en cuotas -</p>
            <div className="relative p-1">
                <div className="text-center">
                    <AddButtonComponent fromScreen="Tarjeta" />
                </div>

                <div className="flex justify-center">
                    <div className="flex justify-between items-center mt-4 w-[48rem]">

                        <ButtonComponent
                            text="⬅️"
                            onClick={() => setStartIndex(handlePrev(startIndex, itemsPerPages))}
                            className="hover:bg-blue-500 text-2xl rounded-full px-3 py-1 flex-shrink-0"
                        />

                        <div className="flex flex-grow justify-center items-center space-x-4 px-4">
                            <ButtonComponent
                                text="Ver actual"
                                onClick={() => focusCurrentMonth(dataMonths, setStartIndex)}
                                className="hover:bg-blue-500 bg-gray-600 px-3 border-gray-950 text-white"
                            />
                            <DropdownItemsPerPageComponent
                                itemsPerPage={itemsPerPages}
                                onItemsPerPageChange={handleItemsPerPageChange}
                            />
                        </div>

                        <ButtonComponent
                            text="➡️"
                            onClick={() => setStartIndex(handleNext(startIndex, itemsPerPages, dataMonths.length))}
                            className="hover:bg-blue-500 text-2xl rounded-full px-3 py-1 flex-shrink-0"
                        />
                    </div>
                </div>

                <CarouselComponent
                    data={currentsMonths}
                    loading={loading}
                    renderItem={(monthData) => (
                        <CardDataComponent
                            monthData={monthData}
                            onDeleteCardSpend={handleDeleteCardSpend}
                        />
                    )}
                />
            </div>
        </div>
    );
};

export default CardScreen;
