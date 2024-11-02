import React, { useEffect, useState } from 'react';

export const FixedCostComponent = () => {
    const [fixedCosts, setFixedCosts] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:5050/api/fixed-cost/")
            .then(res => res.json())
            .then(data => setFixedCosts(data))
            .catch(console.error);
    }, []);

    return (
        <div>
            <ul>
                {fixedCosts.map((cost, index) => (
                    <ul>
                        <li key={index}>{cost.name}</li>
                        <li key={index}>{cost.price}</li>
                    </ul>
                ))}
            </ul>
        </div>
    );
};
