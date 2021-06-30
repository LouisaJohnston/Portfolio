import Head from "next/head";
import { useState, useEffect } from "react"
import styles from "../styles/Index.module.css";
import IntroParagraph from "../components/IntroParagraph";
import Tech from "../components/Tech"
import Project from "../components/Project.jsx";
import projectsJSON from "../projects.json"

export default function Index() {
  const [projects, setProjects] = useState([]) 

  useEffect(() => {
    try {
      const projectData = projectsJSON.projects
      setProjects(projectData)
    } catch (err) {
      console.log(err)
    }
  }, []);


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

        <div className="top-anchor" id="about">
            <IntroParagraph 
              hello={"Hello! "}
              paragraph={"I am a full-stack developer with particular interest in ventures oriented towards social impact and the arts."}
            />
            <IntroParagraph
              paragraph={"I love breaking problems down into their smallest parts in order to build successful interventions. My background in nonprofit marketing has taught me the value of metrics-driven work, creative workarounds, and constructing projects from the user’s perspective."} 
            />
            <IntroParagraph
              paragraph={"In my spare time, I enjoy caring for my brood of houseplants, employing the phone-a-friend approach to crossword solving, and Vincent Price movies."} 
            />
        </div>

        <div className="skill-anchor" id="languages">
          <h2>Skills</h2>
          <div id="lang-specs">
            <Tech 
              head={"Tech Stack"}
              body={"JavaScript, React, CSS, HTML, Python, SQL, Express.js, Next.js, EJS, node.js, PostgreSQL, Axios, Mongoose, and MongoDB"}
            />

            <Tech 
              head={"Misc. Know-How"}
              body={"Heroku, Pygame, Adobe Photoshop, Adobe InDesign, Adobe Premiere, Wordpress, Squarespace, NationBuilder, Google Analytics, Cargo.site, and Canva"}
            />
          </div>
        </div>

        <div className="project-anchor" id="projects">
          <h2>Projects</h2>
          {projects.map((project, i) => {
            return (
              <Project
                key={i.toString()}
                i={i}
                name={project.name}
                tech={project.tech}
                details={project.details}
                github={project.github}
                deployed={project.deployed}
                images={project.images}
              />
            );
          })}
        </div>
      </div>
    </div>  
  );
};
