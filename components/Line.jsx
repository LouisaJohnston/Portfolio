export default function Line({left}) {
    return (
        <div 
            className="line"
            style={{ left:`${left}%` }}
        />
    )
}