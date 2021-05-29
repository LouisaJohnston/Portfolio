import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Louisa Johnston</title>
        <link rel="icon" href="/portfolio_favicon_squareheavy.png" />
      </Head>
      <div id="main">
        <h1>Louisa Johnston</h1>

        <div id="about">
          <div>
            <h2>Greetings!</h2>
            <p>I am a full-stack engineer specializing in front-end 
            development. My particular interest is in ventures 
            with an orientation towards social equity and the arts.</p>   
          </div>
          <div>
            <p>I am a huge fan of breaking problems down into their 
            smallest parts in order to build successful interventions. 
            My background in nonprofit marketing has taught me the 
            value of metrics-driven work, creative workarounds, and 
            constructing projects from the user’s perspective.</p>
          </div>
          <div>
            <p>In my spare time, I enjoy caring for my brood of houseplants, 
            an inordinate amount of crossword puzzles, and inundating friends
            and family with my excess baked goods.</p>
          </div>
        </div>

        <div id="languages">
          <h2>Languages/Frameworks/Misc. Know-How</h2>
          <p>Python, ReactJS, Mongoose, MongoDB, ExpressJS, NodeJS, SQL, PostgreSQL, EJS, Axios, JavaScript, CSS3, HTML5, Heroku, GitHub, Pygame, Adobe Photoshop, Adobe InDesign, Adobe Premiere, WordPress, Squarespace, NationBuilder, Google Analytics, Cargo, and Canva</p>
        </div>

        <div id="projects">
          <h2>Projects</h2>
          
          <a><h3>Bot Noggle</h3></a>                                                                                                                                                              
          <h4>Python, Pygame</h4>
          <ul>
            <li>Built a version of Boggle using Python and Pygame to render a 4x4 grid out of a two-dimensional array of randomized letters corresponding to real Boggle dice</li>
            <li>Allowed users to check whether a given word exists in adjacent grid tiles (up, down, diagonally, forwards, and backwards)</li>
            <li>Inserted dictionary information into a trie data structure to check against user input and optimize the project's time complexity</li>
          </ul>
          <a href="https://github.com/LouisaJohnston/project4" target="_blank"><p>Project Repo</p></a>

          <h3>Paw-Tel (Group Project)</h3>
          <h4>ReactJS, Mongoose, MongoDB, and MERN auth</h4>
          <ul>
            <li>Designed a full-stack MERN app using complex authorization routes allowing users to register as either pet owner or as a pet hotel owner to help pet owners connect with pet hotels</li>
            <li>Employed React components to render information from a local API pertaining to user-specific pets or hotels, depending on the authorization route, with the ability to update and delete data fields</li>
            <li>Saved user input through server-side Mongoose database using MongoDB</li>
          </ul>
          <a href="https://github.com/LouisaJohnston/Paw-tel" target="_blank"><p>Project Repo (Server-Side)</p></a>
          <a href="https://github.com/LouisaJohnston/pawtel-client" target="_blank"><p>Project Repo (Client-Side)</p></a>

          <h3>Flick Picks</h3>
          <h4>EJS, ExpressJS, Axios, NodeJS, and PostgreSQL</h4>
          <ul>
            <li>Created a web app using NodeJS and ExpressJS with the ability for users to create an account or login with encrypted cookie storage and password hashing</li>
            <li>Applied EJS templates and Axios to render information from a third-party film API and allow users to save movies to personal lists</li>
            <li>Stored multiple user inputs (login information and movie comments/reviews) as database information fields through PostgreSQL with the ability for users to update them directly</li>
          </ul>
          <a href="https://github.com/LouisaJohnston/project2" target="_blank"><p>Project Repo</p></a>

          <h3>Word-cross’d Puzzler</h3>
          <h4>JavaScript, CSS3, and HTML5</h4>
          <ul>
            <li>Designed a grid-based 5x5 puzzle to run on in-browser for desktop computers</li>
            <li>Utilized CSS and HTML properties to approximate the experience of a pen-and-paper puzzle with front-end styling considerations implemented through Flexbox</li>
            <li>Developed functionality through JavaScript array manipulation to show time elapsed, toggle between vertical and horizontal input focus flow, check answers, reveal the puzzle, and restart the game through DOM event listeners</li>
          </ul>
          <a href="https://github.com/LouisaJohnston/Word-crossd_Puzzler" target="_blank"><p>Project Repo</p></a>
        </div>

      </div>
    </div>
  )
}
