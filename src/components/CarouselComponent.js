const CarouselComponent = ({ data, renderItem }) => {
  return (
    <div className="relative flex justify-center items-center mt-16 space-x-4">
      <div className="flex space-x-4">
        {data.map((itemData, i) => (
          renderItem(itemData, i)
        ))}
      </div>
    </div>
  );
};

export default CarouselComponent;
