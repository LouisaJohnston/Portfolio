import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
    return (
        <nav>
            <div id='nav-links'>
                <Image 
                    src='/portfolio_logotransparent.png'
                    alt='LJ'
                    width={80}
                    height={80}
                />

                <Link href='#about'>
                    <a>About Me</a>
                </Link>

                <Link href='#languages'>
                    <a>Languages et al.</a>
                </Link>

                <Link href='#projects'>
                    <a>Projects</a>
                </Link>

                <Link href='https://github.com/LouisaJohnston'>
                    <a target='_blank'>GitHub</a>
                </Link>

                <Link href='https://www.linkedin.com/in/louisa-johnston/'>
                    <a target='_blank'>LinkedIn</a>
                </Link>
            </div>
        </nav>
    )
}