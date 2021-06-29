export default function ImageSlide({ image }) {
    const styles = {
        backgroundImage: `url(${image})`,
        backgroundSize:'cover',
        backgroundPosition: 'center'
    }
    return (
        <div className="image-slide" style={ styles }></div>
    )
}