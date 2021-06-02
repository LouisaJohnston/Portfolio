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
                        <Image 
                            src='/portfolio_logotransparent.png'
                            alt='LJ'
                            width={80}
                            height={80}
                            label="Show menu"
                            className="relative"
                        />
                    </div>
                    <div>
                        <NavHashLink 
                            smooth to='#about'
                            activeClassName="selected"
                            activeStyle={{ 'font-size': '1.5em' }}>
                            <a className="desktop-nav">About Me</a>
                        </NavHashLink>
                    </div>

                    <div>
                        <NavHashLink 
                        smooth to='#languages'
                            activeClassName="selected"
                            activeStyle={{ 'font-size': '1.5em' }}>
                            <a className="desktop-nav">Languages</a>
                        </NavHashLink>
                    </div>

                    <div>
                        <NavHashLink 
                            smooth to='#projects'
                            activeClassName="selected"
                            activeStyle={{ 'font-size': '1.5em' }}>
                            <a className="desktop-nav">Projects</a>
                        </NavHashLink>
                    </div>

                    <div>
                        <Link href='https://github.com/LouisaJohnston'>
                            <a className="desktop-nav" 
                                target='_blank'>GitHub</a>
                        </Link>
                    </div>
                        <Link href='https://www.linkedin.com/in/louisa-johnston/'>
                            <a className="desktop-nav" 
                                target='_blank'>LinkedIn</a>
                        </Link>
                    <div>

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
                            <a onClick={() => closeMenu()}>Languages</a>
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