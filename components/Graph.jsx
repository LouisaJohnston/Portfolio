import Line from "./Line"

export default function Graph({}) {
    return (
        <div className="graph-wrapper">
            <div className="graph">
                <Line left={0}/>
                <Line left={10}/>
                <Line left={20}/>
                <Line left={30}/>
            </div>
        </div>
    )
}