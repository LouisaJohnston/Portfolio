// built in link component
import Link from 'next/link'

export default function Navbar() {
    return (
        <nav>
            <div id='nav-links'>
                <Link href='#about'>
                    <a>About Me</a>
                </Link>

                <Link href='#languages'>
                    <a>Languages/Frameworks</a>
                </Link>

                <Link href='#projects'>
                    <a>Projects</a>
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
            </div>
        </nav>
    )
}