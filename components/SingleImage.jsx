import Image from "next/image";

export default function SingleImage ({ name, image }) {
    return (
        <div id="bot-play" className="offset">
            <div id="bot-border">
                    <Image 
                        src={image}
                        alt={`${name} Gameplay`}
                        // width={550}
                        // height={280}
                        layout='fill'
                        objectFit='contain'
                        label={name}
                    />
            </div>
        </div>
    );
};