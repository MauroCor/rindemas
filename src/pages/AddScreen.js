import ButtonComponent from '../components/ButtonComponent';
import DropComponent from '../components/DropComponent';

const AddScreen = () => {

  return (
    <div className="dark bg-gray-900 text-white min-h-screen">
      <div className="flex justify-center items-center flex-wrap space-x-4 p-4">
        <ButtonComponent onClick={1} text="Ingreso" />
        <ButtonComponent onClick={1} text="Egreso" />
        <ButtonComponent onClick={1} text="Gasto con tarjeta" />
        <ButtonComponent onClick={1} text="Ahorro" />
      </div>

      <DropComponent title="Nombre ingreso" />
    </div>
  );
};

export default AddScreen;
