// Button component
const Button = ({ onClick, text, id }) => (
    <button id={id} onClick={onClick}>
        {text}
    </button>
)

export default Button;