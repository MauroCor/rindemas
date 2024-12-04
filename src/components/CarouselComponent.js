import SpinnerComponent from "./SpinnerComponent";

const CarouselComponent = ({ data, renderItem, loading, children }) => {
  return (
    <div>
      {loading ? (
        <SpinnerComponent />
      ) : data && data.length > 0 ? (
        <>
          {children}
          <div className="relative flex justify-center items-center mt-1">
            <div className="flex space-x-4 overflow-x-auto whitespace-nowrap">
              {data.map((itemData, i) => (
                <div key={i} className="w-full">
                  {renderItem(itemData, i)}
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
