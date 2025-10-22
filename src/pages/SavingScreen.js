import { useEffect, useMemo, useState, useRef } from 'react';
import CarouselComponent from '../components/CarouselComponent';
import ButtonComponent from '../components/ButtonComponent';
import DropdownItemsPerPageComponent from '../components/DropdownItemsPerPageComponent';
import SavingDataComponent from '../components/SavingDataComponent';
import { getSavings, deleteSaving, patchSaving } from '../services/saving';
import GraphComponent from '../components/GraphComponent';
import ConfirmDialog from '../components/ConfirmDialog';
import { adjustMonths } from '../utils/numbers';
import { getMonthlyData, handlePrev, handleNext, focusCurrentMonth } from '../utils/useMonthlyData';
import { logFetchError } from '../utils/logger';
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
    const startIndexRef = useRef(0);
    const [loading, setLoading] = useState(true);
    const [includeFutureLiquidity, setIncludeFutureLiquidity] = useState(false);
    const [graphMode, setGraphMode] = useState('portafolio');

    useEffect(() => {
        setLoading(true);
        const fetchData = async (shouldFocus = true) => {
                try {
                    if (exchangeRate !== '') {
                        const savings = await getSavings(`?exchg_rate=${exchangeRate}`, includeFutureLiquidity);
                        const processedSavings = savings.map(month => ({
                            ...month,
                            saving: month.saving.map(item => ({
                                ...item,
                                liquid: item.type === 'flex' || item.type === 'plan' ? true : item.liquid
                            }))
                        }));  
                        setDataMonths(processedSavings);
                        if (shouldFocus) {
                            focusCurrentMonth(processedSavings, setStartIndex, itemsPerPages);
                        }
                    }
            } catch (error) {
                logFetchError('data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        const onDataUpdated = (e) => {
            // Mantener la posición actual del carrusel al actualizar datos
            const currentStartIndex = startIndexRef.current;
            fetchData(false).then(() => {
                // Restaurar la posición del carrusel después de actualizar
                setStartIndex(currentStartIndex);
            });
        };
        window.addEventListener('app:data-updated', onDataUpdated);
        return () => window.removeEventListener('app:data-updated', onDataUpdated);
    }, [exchangeRate, itemsPerPages, includeFutureLiquidity]);

    // Refrescar datos cuando cambie el modo de proyección
    useEffect(() => {
        if (exchangeRate !== '') {
            const fetchData = async () => {
                try {
                    const savings = await getSavings(`?exchg_rate=${exchangeRate}`, includeFutureLiquidity);
                    const processedSavings = savings.map(month => ({
                        ...month,
                        saving: month.saving.map(item => ({
                            ...item,
                            liquid: item.type === 'flex' ? true : item.liquid
                        }))
                    }));
                    setDataMonths(processedSavings);
                    focusCurrentMonth(processedSavings, setStartIndex, itemsPerPages);
                } catch (error) {
                    logFetchError('data', error);
                }
            };
            fetchData();
        }
    }, [includeFutureLiquidity, exchangeRate, itemsPerPages]);

    const filteredDataMonths = dataMonths;

    useEffect(() => {
        setCurrentsMonths(getMonthlyData(filteredDataMonths, startIndex, itemsPerPages));
    }, [filteredDataMonths, startIndex, itemsPerPages]);

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPages(newItemsPerPage);
        focusCurrentMonth(filteredDataMonths, setStartIndex, newItemsPerPage);
    };

    // Actualizar la referencia cuando cambie startIndex
    useEffect(() => {
        startIndexRef.current = startIndex;
    }, [startIndex]);

    const [confirm, setConfirm] = useState({ open: false, message: '', onConfirm: null });
    const handleDeleteSaving = async (saving) => {
        setConfirm({
            open: true,
            message: `¿Eliminar el ahorro '${saving.name}'?`,
            onConfirm: async () => {
                try {
                    await deleteSaving(saving.id);
                    setDataMonths((prevData) => {
                        const updatedData = prevData.map((month) => {
                            const updatedSaving = month.saving.filter((item) => item.id !== saving.id);
                            const newTotal = updatedSaving.reduce((total, item) => {
                                const value = item.ccy === 'ARS' ? (Number(item.obtained) || 0) : ((Number(item.obtained) || 0) * (Number(exchangeRate) || 0));
                                return total + value;
                            }, 0);
                            return {
                                ...month,
                                saving: updatedSaving,
                                total: newTotal
                            };
                        });
                        // Filtrar meses vacíos pero mantener la posición del carrusel
                        return updatedData.filter((month) => month.saving.length > 0);
                    });
                    setConfirm({ open: false, message: '', onConfirm: null });
                } catch (error) {
                    logFetchError('deleting saving', error);
                    setConfirm({ open: false, message: '', onConfirm: null });
                }
            }
        })
    };

    const handlePatchSaving = async (id, data, date) => {
        const body = { ...data, date_to: adjustMonths(date, -1) };
        setConfirm({
            open: true,
            message: `¿${data.type === 'plan' ? 'Detener' : 'Finalizar'} '${data.name}' a partir de ${date}?`,
            onConfirm: async () => {
                try {
                    const result = await patchSaving(id, body);
                    const updatedData = await getSavings(`?exchg_rate=${exchangeRate}`, includeFutureLiquidity);
                    
                    const processedData = updatedData.map(month => ({
                        ...month,
                        saving: month.saving.map(item => ({
                            ...item,
                            liquid: item.type === 'flex' || item.type === 'plan' ? true : item.liquid
                        }))
                    }));
                    
                    setDataMonths(processedData);
                    setConfirm({ open: false, message: '', onConfirm: null });
                } catch (error) {
                    logFetchError('patching saving', error);
                    setConfirm({ open: false, message: '', onConfirm: null });
                }
            }
        });
    };

    // Eliminado: cumulativeLiquidityBeforeByMonth no se utiliza

    const graphDataMonths = useMemo(() => {
        if (!Array.isArray(filteredDataMonths)) return [];
        return filteredDataMonths.map(m => ({
            ...m,
            total: (Number(m.total) || 0)
        }));
    }, [filteredDataMonths]);

    return (
        <>
        <div className="min-h-screen py-4" style={{background:'#111827', color:'#F3F4F6'}}>
            <h1 className="text-center text-2xl font-bold tracking-tight">Ahorros Invertidos</h1>
            <p className="italic text-center text-sm mb-6" style={{color:'#9CA3AF'}}>¿Cuánto crece mi cartera?</p>
            <div className="relative p-1">
                <div className="flex justify-center items-center gap-3">
                    <AddButtonComponent fromScreen="Ahorro" />
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full border" style={{background:'#1F2937', borderColor:'#374151'}}>
                        <span className="text-sm font-medium" style={{color:'#F3F4F6'}}>Proyectar</span>
                        <button
                            type="button"
                            onClick={() => setIncludeFutureLiquidity(!includeFutureLiquidity)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${includeFutureLiquidity ? 'bg-gray-600' : 'bg-gray-600'}`}
                            style={{background: includeFutureLiquidity ? '#16A085' : '#4B5563'}}
                            aria-pressed={includeFutureLiquidity}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${includeFutureLiquidity ? 'translate-x-6' : 'translate-x-0'}`}
                            />
                        </button>
                    </div>
                </div>

                <CarouselComponent
                    data={filteredDataMonths}
                    loading={loading}
                    startIndex={startIndex}
                    itemsPerPages={itemsPerPages}
                    renderItem={(monthData) => (
                        <SavingDataComponent
                            monthData={{
                                ...monthData,
                                total: (Number(monthData.total) || 0)
                            }}
                            onDeleteSaving={handleDeleteSaving}
                            onPatchSaving={handlePatchSaving}
                            exRate={exchangeRate}
                        />
                    )}
                >
                    <div className="flex justify-center top-[52px] z-10">
                        <div className="flex justify-between items-center mt-4 w-[48rem] px-3 py-2 rounded-full border" style={{background:'#0F172A', borderColor:'#1F2937'}}>
                            <ButtonComponent
                                text={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6"><path fill="#F3F4F6" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>}
                                ariaLabel="Anterior"
                                onClick={() => setStartIndex(handlePrev(startIndex, itemsPerPages))}
                                className="hover:bg-gray-700 rounded-full p-1 flex-shrink-0"
                            />
                            <div className="flex flex-grow justify-center items-center space-x-2">
                                <div className="flex items-center rounded-full border overflow-hidden" style={{background:'#1F2937', borderColor:'#374151'}}>
                                    <ButtonComponent
                                        text="Centrar"
                                        ariaLabel="Ir al mes actual"
                                        onClick={() => focusCurrentMonth(dataMonths, setStartIndex, itemsPerPages)}
                                        className={`px-3 py-1 text-xs ${(
                                            Array.isArray(currentsMonths) && currentsMonths.some(m => m.date === new Date().toISOString().slice(0,7))
                                        ) ? 'text-[#D1D5DB]' : 'text-white'}`}
                                        style={{background: Array.isArray(currentsMonths) && currentsMonths.some(m => m.date === new Date().toISOString().slice(0,7)) ? 'transparent' : '#16A085'}}
                                        onMouseEnter={(e) => {
                                          if (!(Array.isArray(currentsMonths) && currentsMonths.some(m => m.date === new Date().toISOString().slice(0,7)))) {
                                            e.target.style.background = '#138D75';
                                          }
                                        }}
                                        onMouseLeave={(e) => {
                                          if (!(Array.isArray(currentsMonths) && currentsMonths.some(m => m.date === new Date().toISOString().slice(0,7)))) {
                                            e.target.style.background = '#16A085';
                                          }
                                        }}
                                    />
                                </div>
                                <DropdownItemsPerPageComponent
                                    itemsPerPage={itemsPerPages}
                                    onItemsPerPageChange={handleItemsPerPageChange}
                                />
                                <ExchangeRateDisplay />
                            </div>
                            <ButtonComponent
                                text={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6"><path fill="#F3F4F6" d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>}
                                ariaLabel="Siguiente"
                                onClick={() => setStartIndex(handleNext(startIndex, itemsPerPages, dataMonths.length))}
                                className="hover:bg-gray-700 rounded-full p-1 flex-shrink-0"
                            />
                        </div>
                    </div>
                </CarouselComponent>
            </div>

            {includeFutureLiquidity && (
                <div className="pt-10 text-center max-w-screen-sm mx-auto">
                    <GraphComponent
                        data={graphDataMonths}
                        showAverage={graphMode === 'portafolio' || graphMode === 'rendimiento'}
                        showSavings={graphMode === 'rendimiento'}
                        graphMode={graphMode}
                        onChangeGraphMode={setGraphMode}
                    />
                </div>
            )}

            <div className="pt-10 text-center max-w-screen-sm mx-auto">
                <PieChartComponent title="Divisas" data={filteredDataMonths} />
            </div>
        </div>
        <ConfirmDialog
            open={confirm.open}
            message={confirm.message}
            onConfirm={confirm.onConfirm}
            onCancel={()=> setConfirm({ open:false, message:'', onConfirm:null })}
        />
        </>
    );
};

export default SavingScreen;
