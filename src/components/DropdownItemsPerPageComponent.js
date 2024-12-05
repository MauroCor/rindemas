const DropdownItemsPerPageComponent = ({ itemsPerPage, onItemsPerPageChange }) => {
  return (
    <div>
      <select
        value={itemsPerPage}
        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        className="bg-gray-600 border-gray-950 mx-2 px-0 py-[2px] text-white"
      >
        <option value={1}>1 mes</option>
        <option value={3}>3 meses</option>
        <option value={5}>5 meses</option>
      </select>
    </div>
  );
};

export default DropdownItemsPerPageComponent;
