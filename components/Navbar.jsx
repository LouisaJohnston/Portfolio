// built in link component
import Link from 'next/link'

export default function Navbar() {
    return (
        <nav>
            <Link href='#about-container'>
                <a>About Me</a>
            </Link>
            <Link href='#projects-container'>
                <a>Projects</a>
            </Link>
            <Link href='#languages-container'>
                <a>Languages/Frameworks</a>
            </Link>
            <Link href='https://github.com/LouisaJohnston'>
                <a target='_blank'>Github</a>
            </Link>
            <Link href='https://www.linkedin.com/in/louisa-johnston/'>
                <a target='_blank'>LinkedIn</a>
            </Link>
            <Link href='/LouisaJohnston_Resume.pdf'>
                <a target='_blank' download>Download Resume</a>
            </Link>
        </nav>
    )
}