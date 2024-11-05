import React, { useState } from 'react';

const DropComponent = () => {
    const [options, setOptions] = useState(["Sueldo", "Aguinaldo"]);

    return (
        <div className="max-w-md mx-auto rounded-lg p-4 mb-2 text-black">
            <input type="text" name="drop" list="drop" />
            <datalist id="drop">
                {options.map((opt, index) => { return (<option key={index} value={opt} />) })}
            </datalist>
        </div>
    );
};

export default DropComponent;