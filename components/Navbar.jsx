import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { NavHashLink } from 'react-router-hash-link';
import Hamburger from 'hamburger-react'

export default function Navbar() {

    const [isOpen, setOpen] = useState(false)

    const handleOpen = () => {
        setOpen(!isOpen);
    }

    const closeMenu = () => {
        setOpen(false)
    }

    return (
        <nav className="navBar">
            <div id="future-flex">
                <div id='nav-links'>
                    <div id="logo">
                        <NavHashLink
                            smooth to='#top'
                            >
                            <Image 
                                src='/portfolio_logotransparent.png'
                                alt='LJ'
                                width={80}
                                height={80}
                                label="Show menu"
                            />
                        </NavHashLink>
                    </div>

                    <div>
                        <NavHashLink 
                            smooth to='#top'
                            activeClassName="selected"
                            activeStyle={{ 'fontSize': '1.5em' }}>
                            <p className="desktop-nav">About Me</p>
                        </NavHashLink>
                    </div>

                    <div>
                        <NavHashLink 
                            smooth to='#languages'
                            activeClassName="selected"
                            activeStyle={{ 'fontSize': '1.5em' }}>
                            <p className="desktop-nav">Skills</p>
                        </NavHashLink>
                    </div>

                    <div>
                        <NavHashLink 
                            smooth to='#projects'
                            activeClassName="selected"
                            activeStyle={{ 'fontSize': '1.5em' }}>
                            <p className="desktop-nav">Projects</p>
                        </NavHashLink>
                    </div>

                    <div>
                        <Link href='https://github.com/LouisaJohnston'>
                            <a className="desktop-nav" 
                                target='_blank'>GitHub</a>
                        </Link>
                    </div>
                    <div>
                        <Link href='https://www.linkedin.com/in/louisa-johnston/'>
                            <a className="desktop-nav" 
                                target='_blank'>LinkedIn</a>
                        </Link>
                    </div>
                </div>
                
                <div>
                    <div className="mobile-nav hamburger">
                        <Hamburger 
                            toggled={isOpen} 
                            toggle={setOpen}
                            onClick={handleOpen}
                            color="#FBCC32"
                        />
                    </div>
                </div>

            </div>

            <div id="mobile-links">
                <ul className={`mobile-nav menuNav ${isOpen ? "showMenu" : ""}`}>
                    <li>
                        <Link href='#about'>
                            <a onClick={() => closeMenu()}>About Me</a>
                        </Link>
                    </li>

                    <li>
                        <Link href='#languages'>
                            <a onClick={() => closeMenu()}>Skills</a>
                        </Link>
                    </li>

                    <li>
                        <Link href='#projects'>
                            <a onClick={() => closeMenu()}>Projects</a>
                        </Link>         
                    </li>   

                    <li>
                        <Link href='https://github.com/LouisaJohnston'
                            onClick={() => closeMenu()}>
                            <a target='_blank'>GitHub</a>
                        </Link>
                    </li>

                    <li>
                        <Link href='https://www.linkedin.com/in/louisa-johnston/'
                            onClick={() => closeMenu()}>
                            <a target='_blank'>LinkedIn</a>
                        </Link>
                    </li>
                </ul>
            </div>            
        </nav>
    )
}