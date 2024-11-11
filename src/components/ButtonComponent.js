const ButtonComponent = ({ onClick, text }) => {
    let buttonClass;

    switch (text) {
        case '⬅️':
        case '➡️':
            buttonClass = 'text-2xl px-1 py-1';
            break;
        case 'Ver actual':
            buttonClass = 'px-2 py-0 rounded-none bg-gray-600 border-gray-950';
            break;
        default:
            buttonClass = 'bg-blue-600';
            break;
    }

    return (
        <button
            onClick={onClick}
            className={`rounded-full hover:bg-blue-500 ${buttonClass}`}>
            {text}
        </button>
    );
};

export default ButtonComponent;
