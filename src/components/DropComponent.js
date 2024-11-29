import React, { useState, useEffect } from 'react';
import { getFixedCosts } from '../services/fixedCost';
import { getIncomes } from '../services/income';
import getSavings from '../services/saving';

const DropComponent = ({ plhdr, onChange, type, value }) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let data;
                switch (type) {
                    case 'income':
                        data = await getIncomes();
                        break;
                    case 'fixedCost':
                        data = await getFixedCosts();
                        break;
                    case 'savingFlex':
                        data = await getSavings();
                        break;
                    case 'savingVar':
                        data = await getSavings();
                        break;
                    default:
                        throw new Error("Opción no válida");
                }

                let names = [
                    ...new Set(
                        data.flatMap(item => {
                            switch (type) {
                                case 'income':
                                    return item.income?.map(incomeItem => incomeItem.name) || [];
                                case 'fixedCost':
                                    return item.fixedCost?.map(fixedCostItem => fixedCostItem.name) || [];
                                case 'savingFlex':
                                    return item.saving
                                        ?.filter(savingItem => savingItem.type === 'flex')
                                        .map(savingItem => savingItem.name) || [];
                                case 'savingVar':
                                    return item.saving
                                        ?.filter(savingItem => savingItem.type === 'var')
                                        .map(savingItem => savingItem.name) || [];
                                default:
                                    return [];
                            }
                        })
                    )
                ];

                names = names.filter(name => name !== "Tarjeta");
                setOptions(names);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [type]);

    return (
        <div className="text-center rounded-lg mb-2">
            <input
                className='text-center bg-gray-700 w-60 p-2 rounded-lg text-white'
                type="text"
                name="drop"
                list="drop"
                value={value}
                autoComplete='off'
                placeholder={plhdr}
                maxLength={20}
                onChange={onChange} />
            <datalist id="drop">
                {options.map((opt, index) => (
                    <option key={index} value={opt} />
                ))}
            </datalist>
        </div>
    );
};

export default DropComponent;
