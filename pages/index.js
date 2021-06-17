import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState } from 'react'
import Puzzler from '../components/puzzler/Puzzler.jsx'
import Flick from '../components/flick/Flick.jsx'
import Pawtel from '../components/pawtel/Pawtel.jsx'
import Bot from '../components/bot/Bot.jsx'

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
        <meta name="description" content="A mobile-responsive personal portfolio using Next.js, React, JavaScript, HTML and CSS." />  
        <meta name="keywords" content="HTML, CSS, JavaScript, React, Python, Full-Stack Developer" />
        <meta name="author" content="Louisa Johnston" />
        <meta property="og:image" content="/Logo.png" />
        <meta property="og:description" content="A mobile-responsive personal portfolio using Next.js, React, JavaScript, HTML and CSS." />
        <meta property="og:url" content="https://www.louisajohnston.com/" />
        <meta property="og:title" content="Louisa Johnston" />
        <title>Louisa Johnston</title>
        <link rel="icon" href="/Logo.png" type="image/x-icon"/>
      </Head>
      <div id="main">
        <h1 className="hide">Louisa Johnston</h1>

        {/******** ABOUT ME *********/}

        <div className="top-anchor" id="about">
          <div>
            <p><span id="hello">Hello!</span> I am a full-stack developer with 
            particular interest in ventures oriented towards social impact 
            and the arts.</p>   
          </div>
          <div>
            <p>I love breaking problems down into their 
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

        {/******** SKILLS *********/}

        <div className="skill-anchor" id="languages">
          <h2>Skills</h2>
          <div id="lang-specs">
            <h3 className="less-flush web-edge">Tech Stack</h3>
            <p className="flush">JavaScript, React, CSS, HTML, Python, SQL, 
              Express.js, Next.js, EJS, node.js, PostgreSQL, Axios, 
              Mongoose, and MongoDB</p>
        
            <h3 className="even-less-flush">Misc. Know-How</h3>
            <p className="flush">Heroku, Pygame, Adobe Photoshop, Adobe InDesign, 
              Adobe Premiere, Wordpress, Squarespace, NationBuilder, 
              Google Analytics, Cargo.site, and Canva</p>
          </div>
        </div>

        {/******** PROJECTS *********/}

        <div className="project-anchor" id="projects">
          <h2>Projects</h2>
          {/* WORD-CROSS'D PUZZLER */}
          <div className="project-box">
            <h3 className="less-flush">
              <a href="https://louisajohnston.github.io/" target="_blank">
                Word-cross’d Puzzler</a>
            </h3>
              <h4 className="italic flush">JavaScript, CSS, and HTML</h4>
              <div>
                { showPuzzler ? <Puzzler /> : null }
                <div className= "details" onClick={ puzzlerClick }>
                  { showPuzzler ? <a>Hide Details</a> : <a>Show Project Details</a> }
                </div>
              </div>
          </div>
          
          {/* FLICK PICKS */}
          <div className="project-box">
            <h3 className="even-less-flush">
              <a href="https://flickpicks-project2.herokuapp.com/" target="_blank">
                Flick Picks</a>
            </h3>
              <h4 className="italic flush">EJS, Express.js, node.js, Axios, and PostgreSQL</h4>
              <div>
                { showFlick ? <Flick /> : null }
                <div className= "details" onClick={ flickClick }>
                  { showFlick ? <a>Hide Details</a> : <a>Show Project Details</a> }
                </div>
              </div>
            </div>
          
          {/* PAW-TEL */}
          <div className="project-box">
            <h3 className="even-less-flush">
              <a href= "https://pawtel-application.herokuapp.com/" target="_blank">
                Paw-Tel (Group Project)</a>
            </h3>
            <h4 className="italic flush">React, Mongoose, MongoDB, and MERN auth</h4>
            <div>
              { showPaw ? <Pawtel /> : null }
              <div className= "details" onClick={ pawClick }>
                { showPaw ? <a>Hide Details</a> : <a>Show Project Details</a> }
              </div>
            </div>
          </div>
          
          {/* BOT NOGGLE */}
          <div className="project-box">
            <h3 className="even-less-flush">
              <a href="https://www.youtube.com/watch?v=MCWT7-8a7iE&ab_channel=LouisaJohnston" target="_blank">
                Bot Noggle</a>
            </h3>                                                                                                                                                        
            <h4 className="italic flush">Python, Pygame</h4>
            <div>
              { showBot ? <Bot /> : null }
              <div className= "details" onClick={ botClick }>
                { showBot ? <a>Hide Details</a> : <a>Show Project Details</a> }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>  
  )
}
