import ProjectDetails from "./ProjectDetails"
import { useState } from "react"

export default function Project({ 
    i,
    name,
    tech,
    details,
    github,
    deployed,
    images
 }) {
    const [showDetails, setShowDetails] = useState(false)
    const [imagesLength, setImagesLength] = useState(false)

    const getImages = () => {
        try {
            if (images.length < 2) {
                setImagesLength(true)
            } else {
                return
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleClick = () => {
        setShowDetails(!showDetails)
        getImages()
    }

    return (
        <div className="project-container" key={i}>
            <h3 className="less-flush">
                <a href={deployed} target="_blank">
                {name}</a>
            </h3>
                <h4 className="italic flush">{tech}</h4>
            <div>
                { showDetails ? <ProjectDetails 
                    i={i}
                    name={name} 
                    details={details} 
                    github={github} 
                    images={images}
                    imagesLength={imagesLength} />
                    : null }
                <div className= "details" onClick={ handleClick }>
                    { showDetails ? <a>Hide Details</a> : <a>Show Project Details</a> }
                </div>
            </div>
        </div>
    )
};