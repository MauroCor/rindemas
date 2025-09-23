import SpinnerComponent from "./SpinnerComponent";

const CarouselComponent = ({ data, renderItem, loading, children, startIndex = 0, itemsPerPages = 3 }) => {
  const buffer = 0; // mostrar exactamente itemsPerPages
  const from = Math.max(0, startIndex - buffer);
  const to = Math.min(data ? data.length : 0, startIndex + itemsPerPages + buffer);
  const windowed = data ? data.slice(from, to) : [];
  return (
    <div>
      {loading ? (
        <SpinnerComponent />
      ) : data && data.length > 0 ? (
        <>
          {children}
          <div className="relative flex justify-center items-center mt-1">
            <div className="flex space-x-4 overflow-x-auto whitespace-nowrap">
              {windowed.map((itemData, i) => (
                <div key={from + i} className="w-full">
                  {renderItem(itemData, from + i)}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div>
          <p className="text-gray-400 text-center mt-4 text-lg pt-6">Parece que no tienes datos aún.</p>
          <p className="text-gray-400 text-center mt-4 text-lg">Usa el botón <span className="font-bold">+ Agregar</span> para empezar.</p>
        </div>
      )}
    </div>
  );
};

export default CarouselComponent;
