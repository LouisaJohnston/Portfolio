import Image from "next/image";

export default function SingleImage ({ name, image }) {
    return (
        <div style={{ marginLeft:"30vw", position: 'relative', width: '50vw', height: '47.5vh' }} id="bot-play" className="offset">
                <Image 
                    src={image}
                    alt={`${name} Gameplay`}
                    layout="fill"
                    objectFit="contain"
                    label={name}
                    placeholder="blur"
                />
        </div>
    );
};