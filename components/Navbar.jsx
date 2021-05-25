// built in link component
import Link from 'next/link'

export default function Navbar() {
    return (
        <nav>
            <Link href='/'>
                <a>About Me</a>
            </Link>
            <Link href='/about'>
                <a>Projects</a>
            </Link>
            <Link href='/meep'>
                <a>Languages/Frameworks</a>
            </Link>
            <Link href='/moop'>
                <a>Resume</a>
            </Link>
        </nav>
    )
}