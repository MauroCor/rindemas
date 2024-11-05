import React from 'react';

const DesplegableComponent = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="border border-gray-600 rounded-lg p-4 mb-2">
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={toggleDropdown}
            >
                <h3 className="font-bold">{title}</h3>
                <span className="text-xl">{isOpen ? '▲' : '▼'}</span>
            </div>
            {isOpen && (
                <div className="mt-2">
                    {children}
                </div>
            )}
        </div>
    );
};

export default DesplegableComponent;