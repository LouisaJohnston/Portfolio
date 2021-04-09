import Image from 'next/image'
import styles from '../styles/About.module.css'
export default function About() {
    return (
        <div>
            <h1>About Page</h1>

            <p className={styles.extraGreen}>I am a super cool software engineer now! I make neat stuff with the codes</p>
        
            <Image 
                src='/vercel.svg'
                alt='logo'
                width={300}
                height={300}
            />

            <Image
                src='https://placekitten.com/300/300'
                alt='a magnificent creature'
                height={300}
                width={300}
            />
        </div>
    )
}