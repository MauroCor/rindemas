const DropdownItemsPerPageComponent = ({ itemsPerPage, onItemsPerPageChange }) => {
  return (
    <div>
      <select
        value={itemsPerPage}
        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        className="bg-gray-600 border-gray-950 ml-2 px-2 py-[2px] text-white"
      >
        <option value={1}>1</option>
        <option value={3}>3</option>
        <option value={5}>5</option>
      </select>
    </div>
  );
};

export default DropdownItemsPerPageComponent;
