// built in link component
import Link from 'next/link'

export default function Navbar() {
    return (
        <nav>
            <Link href='#about-container'>
                <a>About Me</a>
            </Link>
            <Link href='#languages-container'>
                <a>Languages/Frameworks</a>
            </Link>
            <Link href='#projects-container'>
                <a>Projects</a>
            </Link>
            <Link href='#resume-container'>
                <a>Github</a>
            </Link>
            <Link href='#resume-container'>
                <a>Resume</a>
            </Link>
            <Link href='#resume-container'>
                <a>LinkedIn</a>
            </Link>
        </nav>
    )
}