const DropdownItemsPerPageComponent = ({ itemsPerPage, onItemsPerPageChange }) => {
  return (
    <div>
      <select
        value={itemsPerPage}
        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        className="bg-blue-600 w-14 p-2 rounded-full border-black"
      >
        <option value={1}>1</option>
        <option value={3}>3</option>
        <option value={5}>5</option>
      </select>
    </div>
  );
};

export default DropdownItemsPerPageComponent;
