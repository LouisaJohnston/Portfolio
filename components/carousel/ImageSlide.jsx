import Image from 'next/image'

export default function ImageSlide({ url }) {
    const styles = {
        backgroundImage: `url(${url})`,
        backgroundSize:'cover',
        backgroundPosition: 'center'
    }
    return (
        <div className="image-slide" style={ styles }></div>
        // <div>
        //     <Image 
        //         src={ url }
        //         alt='LJ'
        //         width={80}
        //         height={80}
        //         label="Show menu"
        //     />
        // </div>
    )
}