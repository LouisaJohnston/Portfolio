import Image from "next/image";
import { useState, useEffect } from "react";
import Hamburger from "hamburger-react";

export default function Navbar() {
  const [isOpen, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState(null);

  useEffect(() => {
    const onHashChange = () => setActiveHash(window.location.hash || null);
    onHashChange();
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const closeMenu = () => setOpen(false);
  const activeStyle = { fontSize: "1.5em" };

  return (
    <nav className="navBar">
      <div id="future-flex">
        <div id="nav-links">
          <div id="logo">
            <a href="#top">
              <Image
                src="/portfolio_logotransparent.png"
                alt="LJ"
                width={80}
                height={80}
              />
            </a>
          </div>
          <div id="social-links">
            <a
              href="https://github.com/LouisaJohnston"
              className="desktop-nav non-hash"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/louisa-j/"
              className="desktop-nav non-hash"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div>
          <div className="mobile-nav hamburger">
            <Hamburger toggled={isOpen} toggle={setOpen} color="#FBCC32" />
          </div>
        </div>
      </div>

      <div id="mobile-links">
        <ul className={`mobile-nav menuNav ${isOpen ? "showMenu" : ""}`}>
          <li>
            <a href="#about" onClick={closeMenu}>
              About Me
            </a>
          </li>
          <li>
            <a href="#languages" onClick={closeMenu}>
              Skills
            </a>
          </li>
          <li>
            <a
              href="https://github.com/LouisaJohnston"
              onClick={closeMenu}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/louisa-johnston/"
              onClick={closeMenu}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
