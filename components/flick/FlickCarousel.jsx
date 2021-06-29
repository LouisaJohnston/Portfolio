import ImageSlide from "../Images/Carousel/ImageSlide/ImageSlide"
import Arrow from "../Images/Carousel/Arrow/Arrow"
import { useState } from "react"

export default function FlickCarousel() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const imgUrls = [
        "/flick/Home.png",
        "/flick/NewUser.png",
        "/flick/WatchlistSearch.png",
        "/flick/SearchResults.png",
        "/flick/MovieDetails.png",
        "/flick/WatchlistAfter.png",
        "/flick/WatchlistDetails.png"
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