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
        <div className="text-center text-gray-400 mt-4 text-lg pt-6">
          <p>¡Proyecta!</p>
          <p>Comienza agregando tus datos siguiendo el <a href="/rindemas/ayuda" className="text-teal-400 hover:text-teal-300 underline">Manual</a>.</p>
        </div>
      )}
    </div>
  );
};

export default CarouselComponent;
