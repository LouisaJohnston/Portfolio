import ImageSlide from "../carousel/ImageSlide"
import Arrow from "../carousel/Arrow.jsx"
import { useState } from "react"

export default function PawtelCarousel() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const imgUrls = [
        "/pawtel/homepage.png",
        "/pawtel/petpage.png",
        "/pawtel/register.png"
    ]

    const previousSlide = () => {
        const lastIndex = imgUrls.length - 1;
        const shouldResetIndex = currentImageIndex === 0;
        const index =  shouldResetIndex ? lastIndex : currentImageIndex - 1;
        setCurrentImageIndex(index);
      }
      
      const nextSlide = () => {
        const lastIndex = imgUrls.length - 1;
        const shouldResetIndex = currentImageIndex === lastIndex;
        const index =  shouldResetIndex ? 0 : currentImageIndex + 1;

        setCurrentImageIndex(index);
    }

    return (
        <div className="carousel">
            <Arrow
                direction="left"
                clickFunction={ previousSlide }
                glyph="&#9001;"
            />

            <ImageSlide url={ imgUrls[currentImageIndex] }/>

            <Arrow
                direction="right"
                clickFunction={ nextSlide }
                glyph="&#9002;" 
            />
        </div>
    )
}