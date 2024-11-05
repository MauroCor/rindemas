import ButtonComponent from '../components/ButtonComponent';
import DropComponent from '../components/DropComponent';
import InputPriceComponent from '../components/InputPriceComponent';
import MonthDropComponent from '../components/MonthDropComponent';

const AddScreen = () => {

  return (
    <div>
      <div className="flex justify-center items-center flex-wrap space-x-4 p-4">
        <ButtonComponent onClick={1} text="Ingreso" />
        <ButtonComponent onClick={1} text="Egreso" />
        <ButtonComponent onClick={1} text="Gasto con tarjeta" />
        <ButtonComponent onClick={1} text="Ahorro" />
      </div>

      <DropComponent />
      <InputPriceComponent />
      <MonthDropComponent />
      <ButtonComponent onClick={1} text="OK" />
    </div>
  );
};

export default AddScreen;
