import { useAddModal } from './AddModalContext';

const AddButtonComponent = ({ fromScreen }) => {
    const { openAddModal } = useAddModal();
    return (
        <button
            onClick={() => openAddModal(fromScreen)}
            aria-label={`Agregar en ${fromScreen}`}
            className="inline-flex items-center gap-2 text-white bg-green-600 hover:bg-green-500 active:bg-green-700 rounded-full text-sm px-4 py-2 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-0 transition"
        >
            <span className="inline-block w-5 h-5 rounded-full bg-white/20 text-center leading-5">+</span>
            Agregar
        </button>
    );
};

export default AddButtonComponent;
