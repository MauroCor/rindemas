import React, { useState, useEffect } from 'react';
import { getFixedCosts } from '../services/fixedCost'; // Importa la función de fixedCost
import { getIncomes } from '../services/income'; // Importa la función de incomes

const DropComponent = ({ plhdr, onChange, type }) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let data;
                if (type === 'income') {
                    data = await getIncomes();  // Llama a la función getIncomes
                } else {
                    data = await getFixedCosts();  // Llama a la función getFixedCosts
                }
                
                // Mapea los datos obtenidos para extraer los nombres
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
    }, [type]);  // El efecto depende del 'type' para cargar los datos correctos

    return (
        <div className="text-center rounded-lg mb-2">
            <input
                className='bg-gray-700 w-60'
                type="text"
                name="drop"
                list="drop"
                placeholder={plhdr}
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
