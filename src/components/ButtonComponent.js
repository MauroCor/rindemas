const ButtonComponent = ({ onClick, text, className, ariaLabel }) => {
    return (
        <button
            onClick={onClick}
            className={className}
            aria-label={ariaLabel || text}>
            {text}
        </button>
    );
};

export default ButtonComponent;
