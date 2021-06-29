import Arrow from "./Arrow/Arrow.jsx"
import ImageSlide from "../ImageSlide/ImageSlide.jsx"

export default function Carousel({ images }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    return (
        <div>
            <Arrow
                direction="left"
                clickFunction={ previousSlide }
                glyph="&#9001;"
            />
    
            <ImageSlide url={ images[currentImageIndex] }/>
    
            <Arrow
                direction="right"
                clickFunction={ nextSlide }
                glyph="&#9002;" 
            />
        </div>
    )
}