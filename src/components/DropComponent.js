import React, { useState, useEffect } from 'react';
import { getFixedCosts } from '../services/fixedCost';
import { getIncomes } from '../services/income';

const DropComponent = ({ plhdr, onChange, type }) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let data;
                if (type === 'income') {
                    data = await getIncomes();
                } else {
                    data = await getFixedCosts();
                }
                
                let names = [
                    ...new Set(
                        data.flatMap(item => 
                            type === 'income' 
                                ? item.income.map(incomeItem => incomeItem.name) 
                                : item.fixedCost.map(fixedCostItem => fixedCostItem.name)
                        )
                    )
                ];
                
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
