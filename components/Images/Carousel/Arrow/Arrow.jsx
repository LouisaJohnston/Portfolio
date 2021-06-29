export default function Arrow ({ direction, clickFunction, glyph }) {
    return (
        <div
            className={ `slide-arrow ${direction}` }
            onClick={ clickFunction }>
            { glyph }
        </div>
    )
}