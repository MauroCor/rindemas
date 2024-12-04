import { Link } from "react-router-dom";

const AddButtonComponent = ({ fromScreen }) => {
    return (
        <Link
            to={`/agregar?selectedOption=${fromScreen}`}
            className="text-white bg-gradient-to-br from-[#4b76c8] to-[#1f4691] rounded-[45px] text-[15px] p-[10px] border-4 border-[#252525] shadow-[ -6px_-5px_18px_rgba(255,255,255,0.1)] cursor-pointer"
        >
            + Agregar
        </Link>
    );
};

export default AddButtonComponent;
