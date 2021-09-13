import Image from "next/image";

export default function ImageSlide({ image, name }) {
    return (
        <div  style={{ position: 'relative', width: '60vw', height: '47.5vh' }} className="image-slide">
            <Image 
                src={image}
                alt={`${name} Gameplay`}
                layout="fill"
                objectFit="contain"
                label={name}
                priority={true}
            />
        </div>
    );
};