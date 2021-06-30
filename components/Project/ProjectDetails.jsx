import SingleImage from "../images/singleimage/SingleImage.jsx"
import Carousel from "../images/carousel/Carousel.jsx"

export default function ProjectDetails({
    i,
    name,
    details,
    github,
    images,
    imagesLength    
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
            <a href={github} target="_blank" className="repo less-flush offset block det-link">{name} Repo</a>
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