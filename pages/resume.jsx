import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Resume.module.css'
export default function Resume() {
    return (
        <div>
            <Image 
                src='/LouisaJohnston_Resume.png'
                alt='Resume'
                width={730}
                height={930}
            />
            <Link href='/LouisaJohnston_Resume.pdf'>
                <a target='_blank' download>Download Resume</a>
            </Link>
        </div>
    )
}