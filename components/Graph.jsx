import Line from "./Line"
import BarTextContent from "./BarTextContent"
import Bar from "./Bar"

export default function Graph({}) {

    const renderLines = () => {
        return Array(10).fill(null).map((tech, i) => (
            <Line 
                left={i * 10}
                key={i}
            />
        ))
    }
    return (
        <div className="graph-wrapper">
            <div className="graph">
                <BarTextContent />
                <div className="bar-lines-container">
                    {renderLines()}

                    <Bar percent={50} />
                    <Bar percent={25} />
                    <Bar percent={25} />
                </div>
            </div>
        </div>
    )
}