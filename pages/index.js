import Head from "next/head";
import { useState, useEffect } from "react";
// import styles from "../styles/index.module.css";
import IntroParagraph from "../components/IntroParagraph";
import Tech from "../components/Tech";
import Project from "../components/Project.jsx";
import projectsJSON from "../projects.json";
import Graph from "../components/Graph"

export default function Index() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    try {
      const projectData = projectsJSON.projects;
      setProjects(projectData);
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div className="container">
      <Head>
        <meta
          name="description"
          content="A mobile-responsive personal portfolio using Next.js, React, JavaScript, HTML and CSS."
        />
        <meta
          name="keywords"
          content="HTML, CSS, JavaScript, React, Python, Full-Stack Developer"
        />
        <meta name="author" content="Louisa Johnston" />
        <meta property="og:image" content="/Logo.png" />
        <meta
          property="og:description"
          content="A mobile-responsive personal portfolio using Next.js, React, JavaScript, HTML and CSS."
        />
        <meta property="og:url" content="https://www.louisajohnston.com/" />
        <meta property="og:title" content="Louisa Johnston" />
        <title>Louisa Johnston</title>
        <link rel="icon" href="/Logo.png" type="image/x-icon" />
      </Head>

      <div id="main">
        <h1 style={{ display: "none" }}>Louisa Johnston</h1>

        <div className="top-anchor" id="about">
          <IntroParagraph
            hello={"Hello! "}
            paragraph={
              "I'm an Oakland-based full-stack developer with particular interest in social impact projects and the arts."
            }
          />
          <IntroParagraph
            paragraph={
              "In my spare time, I can be found employing the phone-a-friend approach to crossword solving, planning walks that triangulate the dog parks in my neighborhood, or saying 'Hey, they're in ___!' when I recognize an actor in something I'm watching."
            }
          />
        </div>

        <div className="skill-anchor" id="languages">
          <h2>Skills</h2>
          {/* <div>
            <h3>Most Frequently Used Project Tech</h3>
            <Graph />
          </div> */}
          <div id="lang-specs">
            <Tech
              head={"Tech Stack"}
              body={
                "Axios, C#, CSS3, EJS, Express.js, JavaScript, MongoDB, Mongoose, MySQL, Next.js, Node.js, PostgreSQL, Python, Public APIs, React, Redux, Redux Thunk, Sequelize, SQL, Socket.IO, TypeScript, and HTML5"
              }
            />

            <Tech
              head={"Misc. Know-How"}
              body={
                "Adobe Creative Suite, Canva, Cargo, Figma, GitHub, Google Analytics, Heroku, NationBuilder, Netlify, Next.js, Postman, Pygame, Squarespace, Vercel, WordPress"
              }
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
                group={project.group}
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
}
