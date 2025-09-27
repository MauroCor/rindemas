import { useEffect, useMemo, useState } from 'react';
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
    const [loading, setLoading] = useState(true);
    const [includeFutureLiquidity, setIncludeFutureLiquidity] = useState(true);
    const [graphMode, setGraphMode] = useState('total+avg');

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
                logFetchError('data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        const onDataUpdated = (e) => {
            fetchData();
        };
        window.addEventListener('app:data-updated', onDataUpdated);
        return () => window.removeEventListener('app:data-updated', onDataUpdated);
    }, [exchangeRate, itemsPerPages]);


    // Filtrar ahorros según el modo proyección
    const filteredDataMonths = useMemo(() => {
        if (!Array.isArray(dataMonths)) return dataMonths;
        
        return dataMonths.map(month => ({
            ...month,
            saving: month.saving.filter(saving => {
                // Si el modo proyección está activado, mostrar todos los ahorros
                if (includeFutureLiquidity) {
                    return true;
                }
                // Si el modo proyección está desactivado, ocultar ahorros con projection: true
                return !saving.projection;
            })
        }));
    }, [dataMonths, includeFutureLiquidity]);

    useEffect(() => {
        setCurrentsMonths(getMonthlyData(filteredDataMonths, startIndex, itemsPerPages));
    }, [filteredDataMonths, startIndex, itemsPerPages]);

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPages(newItemsPerPage);
        focusCurrentMonth(filteredDataMonths, setStartIndex, newItemsPerPage);
    };

    const [confirm, setConfirm] = useState({ open: false, message: '', onConfirm: null });
    const handleDeleteSaving = async (saving) => {
        setConfirm({
            open: true,
            message: `¿Eliminar el ahorro '${saving.name}'?`,
            onConfirm: async () => {
                try {
                    await deleteSaving(saving.id);
                    setDataMonths((prevData) =>
                        prevData.map((month) => {
                            const updatedSaving = month.saving.filter((item) => item.id !== saving.id);
                            // Recalcular el total del mes basado en los ahorros restantes
                            const newTotal = updatedSaving.reduce((total, item) => {
                                const value = item.ccy === 'ARS' ? (Number(item.obtained) || 0) : ((Number(item.obtained) || 0) * (Number(exchangeRate) || 0));
                                return total + value;
                            }, 0);
                            return {
                                ...month,
                                saving: updatedSaving,
                                total: newTotal
                            };
                        })
                    );
                    setDataMonths((prevData) => prevData.filter((month) => month.saving.length > 0));
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
            message: `¿Finalizar '${data.name}' a partir de ${date}?`,
            onConfirm: async () => {
                try {
                    await patchSaving(id, body);
                    const updatedData = await getSavings(`?exchg_rate=${exchangeRate}`);
                    setDataMonths(updatedData);
                    setConfirm({ open: false, message: '', onConfirm: null });
                } catch (error) {
                    logFetchError('patching saving', error);
                    setConfirm({ open: false, message: '', onConfirm: null });
                }
            }
        });
    };

    // (toggle OFF) mostrará el total puro del mes (sin running max)

    // Suma acumulada de liquidez previa a cada mes (para proyección pasiva)
    const cumulativeLiquidityBeforeByMonth = useMemo(() => {
        const map = new Map();
        if (!Array.isArray(dataMonths)) return map;
        const sorted = [...dataMonths].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
        let prefix = 0;
        for (let i = 0; i < sorted.length; i++) {
            const m = sorted[i];
            // Solo vencimientos del mes (no RP/RV en curso) para el carry de proyección
            const monthLiquid = Array.isArray(m.saving)
                ? m.saving
                    .filter(s => s.date_to === m.date)
                    .reduce((sum, s) => sum + (s.ccy === 'ARS' ? (Number(s.obtained) || 0) : ((Number(s.obtained) || 0) * (Number(exchangeRate) || 0))), 0)
                : 0;
            map.set(m.date, prefix);
            prefix += monthLiquid;
        }
        return map;
    }, [dataMonths, exchangeRate]);

    const graphDataMonths = useMemo(() => {
        if (!Array.isArray(filteredDataMonths)) return [];
        return filteredDataMonths.map(m => ({
            ...m,
            total: includeFutureLiquidity
                ? ((Number(m.total) || 0) + (cumulativeLiquidityBeforeByMonth.get(m.date) || 0))
                : (Number(m.total) || 0)
        }));
    }, [filteredDataMonths, includeFutureLiquidity, cumulativeLiquidityBeforeByMonth]);

    return (
        <>
        <div className="min-h-screen py-4" style={{background:'#111827', color:'#F3F4F6'}}>
            <h1 className="text-center text-2xl font-bold tracking-tight">Ahorros Invertidos</h1>
            <p className="italic text-center text-sm mb-6" style={{color:'#9CA3AF'}}>¿Cuánto crecen mis ahorros?</p>
            <div className="relative p-1">
                <div className="flex justify-center items-center gap-3">
                    <AddButtonComponent fromScreen="Ahorro" />
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full border" style={{background:'#1F2937', borderColor:'#374151'}}>
                        <span className="text-sm font-medium" style={{color:'#F3F4F6'}}>Modo proyección</span>
                        <button
                            type="button"
                            onClick={() => setIncludeFutureLiquidity(!includeFutureLiquidity)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${includeFutureLiquidity ? 'bg-teal-500' : 'bg-gray-600'}`}
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
                                total: includeFutureLiquidity
                                    ? ((Number(monthData.total) || 0) + (cumulativeLiquidityBeforeByMonth.get(monthData.date) || 0))
                                    : (Number(monthData.total) || 0)
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
                                        text="Actual"
                                        ariaLabel="Ir al mes actual"
                                        onClick={() => focusCurrentMonth(dataMonths, setStartIndex, itemsPerPages)}
                                        className={`px-3 py-1 text-xs ${(
                                            Array.isArray(currentsMonths) && currentsMonths.some(m => m.date === new Date().toISOString().slice(0,7))
                                        ) ? 'text-[#D1D5DB]' : 'bg-teal-600 hover:bg-teal-500 text-white'}`}
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

            <div className="pt-10 text-center max-w-screen-sm mx-auto">
                <GraphComponent
                    data={graphDataMonths}
                    showAverage={graphMode === 'total+avg' || graphMode === 'todo'}
                    showSavings={graphMode === 'todo'}
                    graphMode={graphMode}
                    onChangeGraphMode={setGraphMode}
                />
            </div>

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
