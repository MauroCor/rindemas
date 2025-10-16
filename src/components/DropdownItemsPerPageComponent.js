const DropdownItemsPerPageComponent = ({ itemsPerPage, onItemsPerPageChange }) => {
  const options = [1, 3, 5];
  return (
    <div className="flex items-center">
      <div className="flex items-center rounded-full border overflow-hidden" style={{background:'#1F2937', borderColor:'#374151'}}>
        {options.map((opt, idx) => (
          <button
            key={opt}
            onClick={() => onItemsPerPageChange(opt)}
            className={`px-3 py-1 text-xs ${itemsPerPage === opt ? 'text-white' : ''}`}
            style={{
              background: itemsPerPage === opt ? '#27AE60' : 'transparent',
              color: itemsPerPage === opt ? '#FFFFFF' : '#D1D5DB',
              borderRight: idx < options.length - 1 ? '1px solid #374151' : 'none'
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DropdownItemsPerPageComponent;
