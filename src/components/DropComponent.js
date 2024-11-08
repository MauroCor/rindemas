import React, { useState } from 'react';

const DropComponent = ({plhdr}) => {
    const [options, setOptions] = useState(["Sueldo", "Aguinaldo"]);

    return (
        <div className="text-center rounded-lg mb-2">
            <input className='bg-gray-700 w-60' type="text" name="drop" list="drop" placeholder={plhdr} />
            <datalist id="drop">
                {options.map((opt, index) => (<option key={index} value={opt} />))}
            </datalist>
        </div>
    );
};

export default DropComponent;