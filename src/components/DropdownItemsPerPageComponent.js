const DropdownItemsPerPageComponent = ({ itemsPerPage, onItemsPerPageChange }) => {
  return (
    <div>
      <select
        value={itemsPerPage}
        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        className="bg-gray-600 pl-2 pr-8 border-gray-950 ml-2"
      >
        <option value={1}>1</option>
        <option value={3}>3</option>
        <option value={5}>5</option>
      </select>
    </div>
  );
};

export default DropdownItemsPerPageComponent;
