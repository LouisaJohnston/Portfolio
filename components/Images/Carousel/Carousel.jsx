import Arrow from "./Arrow/Arrow.jsx";
import ImageSlide from "./ImageSlide/ImageSlide.jsx";
import { useState } from "react";

export default function Carousel({ images }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const LENGTH = images.length;

    const previousSlide = () => {
        const lastIndex = LENGTH - 1;
        const shouldResetIndex = currentImageIndex === 0;
        const index =  shouldResetIndex ? lastIndex : currentImageIndex - 1;
        setCurrentImageIndex(index);
      }

      const nextSlide = () => {
        const lastIndex = LENGTH - 1;
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
    
            <ImageSlide image={ images[currentImageIndex] }/>
    
            <Arrow
                direction="right"
                clickFunction={ nextSlide }
                glyph="&#9002;" 
            />
        </div>
    )
}