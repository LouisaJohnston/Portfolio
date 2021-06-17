import ImageSlide from "./ImageSlide"
import Arrow from "./Arrow"
import { useState } from "react"

export default function Puzzler() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const imgUrls = [
        "/puzzler/initial.png",
        "/puzzler/check.png",
        "/puzzler/instructions.png",
        "/puzzler/winstate.png"
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
                glyph="&#9664;"
            />

            <ImageSlide url={ imgUrls[currentImageIndex] }/>

            <Arrow
                direction="right"
                clickFunction={ nextSlide }
                glyph="&#9654;" />
        </div>
    )
}