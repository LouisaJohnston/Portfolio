import SingleImage from "./SingleImage.jsx"
import Carousel from "./Carousel.jsx"

export default function ProjectDetails({
    i,
    name,
    details,
    github,
    images,
    imagesLength,
    gitLength    
}) {
    
    return(
        <div key={i}>
            <ul className="less-flush">
            {details.map((detail, i) => {
                return (
                    <li key={i}>{detail}</li>
                )
            })}
            </ul>
            {gitLength ? (
                <a href={github[0]} target="_blank" className="repo less-flush offset block det-link">{name} Repo</a>
            ) : (
                <div>
                    <a href={github[0]} target="_blank" className="repo less-flush offset block det-link">{name} Server Repo</a>
                    <a href={github[1]} target="_blank" className="repo flush offset block det-link">{name} Client Repo</a>
                </div>
            )}
            {imagesLength ? (
                <SingleImage 
                    name={name}
                    image={ images[0] }
                />
            ) : (
                <Carousel 
                    name={name}    
                    images={ images }
                />
            )}
        </div>
    )
}