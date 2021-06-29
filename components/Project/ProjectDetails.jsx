import Image from "../Images/Image.jsx"
import Carousel from "../Images/Carousel"
import { useState, useEffect } from "react"

export default function ProjectDetails({
    i,
    name,
    details,
    github,
    images    
}) {
    const [imagesLength, setImagesLength] = useState(false)

    useEffect(() => {
        const getImages = () => {
            try {
                if (images.length <= 1) {
                    setImagesLength(true)
                } else {
                    return
                }
            } catch (err) {
                console.log(err)
            }
        }
        getImages()
    }, [images])

    
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
                <Image 
                    name={name}
                    images={images}
                />
            ) : (
                <Carousel 
                    name={name}    
                    images={images}
                />
            )}
        </div>
    )
}