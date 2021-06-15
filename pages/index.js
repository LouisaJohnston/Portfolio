import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState } from 'react'
import Puzzler from '../components/Puzzler.jsx'
import Flick from '../components/Flick.jsx'
import Pawtel from '../components/Pawtel.jsx'
import Bot from '../components/Bot.jsx'

export default function Home() {
  const [showPuzzler, setPuzzler] = useState(false);
  const [showFlick, setFlick] = useState(false);
  const [showPaw, setPaw] = useState(false);
  const [showBot, setBot] = useState(false);

  const puzzlerClick = () => {
      setPuzzler(!showPuzzler)
  };

  const flickClick = () => {
      setFlick(!showFlick)
  };
  
  const pawClick = () => {
      setPaw(!showPaw)
  };

  const botClick = () => {
    setBot(!showBot)
};

  return (
    <div className={styles.container}>
      <Head>
        <title>Louisa Johnston</title>
        <link rel="icon" href="/portfolio_favicon_squareheavy.png" />
      </Head>
      <div id="main">
        <h1 className="hide">Louisa Johnston</h1>

        <div className="top-anchor" id="about">
          <div>
            <p><span id="hello">Hello!</span> I am a full-stack developer with 
            particular interest in ventures oriented towards social equity 
            and the arts.</p>   
          </div>
          <div>
            <p>I am passionate about breaking problems down into their 
            smallest parts in order to build successful interventions. 
            My background in nonprofit marketing has taught me the 
            value of metrics-driven work, creative workarounds, and 
            constructing projects from the user’s perspective.</p>
          </div>
          <div>
            <p>In my spare time, I enjoy caring for my brood of houseplants, 
            employing the phone-a-friend approach to crossword solving, and 
            Vincent Price movies.</p>
          </div>
        </div>

        <div className="anchor" id="languages">
          <h2>Skills</h2>
          <div id="lang-specs">
            <h3 className="less-flush web-edge">Tech Stack</h3>
            <p className="flush">Python, JavaScript, CSS, HTML, SQL, Express.js, 
              Next.js, EJS, node.js, PostgreSQL, React, Axios, Mongoose, and MongoDB</p>
        
            <h3 className="even-less-flush">Misc. Know-How</h3>
            <p className="flush">Heroku, Pygame, Adobe Photoshop, Adobe InDesign, 
              Adobe Premiere, Wordpress, Squarespace, NationBuilder, Google Analytics, 
              Cargo.site, and Canva</p>
          </div>
        </div>

        <div className="anchor" id="projects">
          <h2>Projects</h2>

          <div className="project-box">
          <h3 className="even-less-flush"><a href="https://louisajohnston.github.io/" target="_blank">Word-cross’d Puzzler</a></h3>
            <h4 className="italic flush">JavaScript, CSS, and HTML</h4>
            <div>
              <div className= "details" onClick={ puzzlerClick }>{ showPuzzler ? <a>Hide Details</a> : <a>Show Details</a> }</div>
              { showPuzzler ? <Puzzler /> : null }
            </div>
          </div>

          <div className="project-box">
          <h3 className="even-less-flush"><a href="https://flickpicks-project2.herokuapp.com/" target="_blank">Flick Picks</a></h3>
            <h4 className="italic flush">EJS, Express.js, node.js, Axios, and PostgreSQL</h4>
            <div>
              <div className= "details" onClick={ flickClick }>{ showFlick ? <a>Hide Details</a> : <a>Show Details</a> }</div>
              { showFlick ? <Flick /> : null }
            </div>
          </div>
        </div>

        <div className="project-box">
          <h3 className="even-less-flush"><a href= "https://pawtel-application.herokuapp.com/" target="_blank">Paw-Tel (Group Project)</a></h3>
            <h4 className="italic flush">React, Mongoose, MongoDB, and MERN auth</h4>
            <div>
              <div className= "details" onClick={ pawClick }>{ showPaw ? <a>Hide Details</a> : <a>Show Details</a> }</div>
              { showPaw ? <Pawtel /> : null }
            </div>
          </div>

        <div className="project-box">
          <h3 className="even-less-flush"><a href="https://www.youtube.com/watch?v=MCWT7-8a7iE&ab_channel=LouisaJohnston" target="_blank">Bot Noggle</a></h3>                                                                                                                                                        
          <h4 className="italic flush">Python, Pygame</h4>
          <div>
              <div className= "details" onClick={ botClick }>{ showBot ? <a>Hide Details</a> : <a>Show Details</a> }</div>
              { showBot ? <Bot /> : null }
          </div>
        </div>

      </div>
    </div>  
  )
}
