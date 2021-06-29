export default function Image ({ images }) {
    return (
        <div id="bot-play" className="offset">
            <div id="bot-border">
                    <Image 
                        src={images}
                        alt='Gameplay'
                        width={550}
                        height={280}
                        label={name}
                    />
            </div>
        </div>
    )
}