const CarouselComponent = ({ data, renderItem }) => {
  return (
    <div className="relative flex justify-center items-center mt-1">
      <div className="flex space-x-4 overflow-x-auto whitespace-nowrap">
        {data.map((itemData, i) => (
          <div key={i} className="inline-block">
            {renderItem(itemData, i)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselComponent;
