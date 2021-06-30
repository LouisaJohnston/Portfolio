import Image from "next/image"

export default function SingleImage ({ name, image }) {
    return (
        <div id="bot-play" className="offset">
            <div id="bot-border">
                    <Image 
                        src={image}
                        alt='Gameplay'
                        width={550}
                        height={280}
                        label={name}
                    />
            </div>
        </div>
    )
}