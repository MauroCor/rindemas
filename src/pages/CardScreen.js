import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CarouselComponent from '../components/CarouselComponent';
import ButtonComponent from '../components/ButtonComponent';
import DropdownItemsPerPageComponent from '../components/DropdownItemsPerPageComponent';
import CardDataComponent from '../components/CardDataComponent';
import getCardSpends from '../services/cardSpend';
import { deleteCardSpend } from '../services/cardSpend';
import { parse, isSameMonth} from "date-fns";

const CardScreen = () => {
    const [dataMonths, setDataMonths] = useState([]);
    const [itemsPerPages, setItemsPerPages] = useState(3);
    const [currentsMonths, setCurrentsMonths] = useState([]);
    const [startIndex, setStartIndex] = useState(0);

    const focusCurrentMonth = () => {
        const currentDate = new Date();
        let currentIndex = dataMonths.findIndex((month) => {
            const monthDate = parse(month.date, 'yyyy-MM', new Date());
            return isSameMonth(monthDate, currentDate);
        });

        // Si no se encuentra el mes actual, buscar el siguiente mes con datos
        if (currentIndex === -1) {
            for (let i = 1; i < dataMonths.length; i++) {
                const nextMonthDate = parse(dataMonths[i].date, 'yyyy-MM', new Date());
                if (nextMonthDate > currentDate) {
                    currentIndex = i;
                    break;
                }
            }
        }

        if (currentIndex !== -1) {
            return currentIndex - 1;
        }

        return 0; // Si no hay datos disponibles, mostrar los primeros meses
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cardSpends = await getCardSpends();
                setDataMonths(cardSpends);

                const initialIndex = focusCurrentMonth();
                setStartIndex(initialIndex);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
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

    const handleDeleteCardSpend = async (id) => {
        const isConfirmed = window.confirm(`¿Quiere eliminar el gasto de tarjeta completamente?`);

        if (isConfirmed) {
            try {
                await deleteCardSpend(id);

                setDataMonths((prevData) =>
                    prevData.map((month) => ({
                        ...month,
                        cardSpend: month.cardSpend.filter((item) => item.id !== id),
                    }))
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
                {/* Botón Agregar */}
                <div className="text-center">
                    <Link
                        className="text-white bg-gradient-to-br from-[#4b76c8] to-[#1f4691] rounded-[45px] text-[15px] p-[10px] border-4 border-[#252525] shadow-[ -6px_-5px_18px_rgba(255,255,255,0.1)] cursor-pointer"
                        to="/agregar"
                    >
                        + Agregar
                    </Link>
                </div>

                {/* Contenedor de botones y dropdown */}
                <div className="flex justify-center">
                    <div className="flex justify-between items-center mt-4 w-[48rem]">
                        {/* Botón Izquierdo */}
                        <ButtonComponent
                            text="⬅️"
                            onClick={handlePrev}
                            className="hover:bg-blue-500 text-2xl rounded-full px-3 py-1 flex-shrink-0"
                        />

                        {/* Botones Carrusel */}
                        <div className="flex flex-grow justify-center items-center space-x-4 px-4">
                            <ButtonComponent
                                text="Ver actual"
                                onClick={focusCurrentMonth}
                                className="hover:bg-blue-500 bg-gray-600 px-3 border-gray-950 text-white"
                            />
                            <DropdownItemsPerPageComponent
                                itemsPerPage={itemsPerPages}
                                onItemsPerPageChange={handleItemsPerPageChange}
                            />
                        </div>

                        {/* Botón Derecho */}
                        <ButtonComponent
                            text="➡️"
                            onClick={handleNext}
                            className="hover:bg-blue-500 text-2xl rounded-full px-3 py-1 flex-shrink-0"
                        />
                    </div>
                </div>

                {/* Componente Carrusel */}
                <CarouselComponent
                    data={currentsMonths}
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
