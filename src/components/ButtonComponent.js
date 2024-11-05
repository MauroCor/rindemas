const ButtonComponent = ({ onClick, text }) => (
    <button
        onClick={onClick}
        className="bg-blue-600 rounded-full px-4 py-2 hover:bg-blue-500">
        {text}
    </button>
);

export default ButtonComponent;