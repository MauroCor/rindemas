const CarouselComponent = ({ data, renderItem }) => {
  return (
    <div className="relative flex justify-center items-center mt-1">
      {data && data.length > 0 ? (
        <div className="flex space-x-4 overflow-x-auto whitespace-nowrap">
          {data.map((itemData, i) => (
            <div key={i} className="inline-block">
              {renderItem(itemData, i)}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-4 text-lg p-10">Aún no hay datos cargados para visualizar.</p>
      )}
    </div>
  );
};

export default CarouselComponent;
