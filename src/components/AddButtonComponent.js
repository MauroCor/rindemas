import { useAddModal } from './AddModalContext';

const AddButtonComponent = ({ fromScreen }) => {
    const { openAddModal } = useAddModal();
    return (
        <button
            onClick={() => openAddModal(fromScreen)}
            aria-label={`Agregar en ${fromScreen}`}
            className="inline-flex items-center gap-2 text-white rounded-full text-sm px-4 py-2 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition"
            style={{background: '#16A085'}}
            onMouseEnter={(e) => e.target.style.background = '#138D75'}
            onMouseLeave={(e) => e.target.style.background = '#16A085'}
        >
            <span className="inline-block w-5 h-5 rounded-full bg-white/20 text-center leading-5">+</span>
            Agregar
        </button>
    );
};

export default AddButtonComponent;
