export default function Arrow ({ direction, clickFunction, glyph }) {
    return (
        <div>
            <button
                style={{
                    backgroundColor:"rgba(0, 0, 0, 0)",
                    border:"none",
                    textDecoration:"none",
                    cursor:"pointer",
                    textAlign:"center",
                    color:"#C66403",
                    fontSize:"2rem",
                    top:"50%"
                }}
                className={ `slide-arrow ${direction}` }
                onClick={ clickFunction }
            >
                { glyph }
            </button>
        </div>
    );
};