import Head from "next/head";
import { useState, useEffect } from "react";
// import styles from "../styles/index.module.css";
import IntroParagraph from "../components/IntroParagraph";
import Tech from "../components/Tech";
import Project from "../components/Project.jsx";
import projectsJSON from "../projects.json";
import Graph from "../components/Graph";

export default function Index() {
  const [projects, setProjects] = useState([]);
  const [mostUsed, setMostUsed] = useState([]);

  useEffect(() => {
    try {
      const projectData = projectsJSON.projects;
      setProjects(projectData);

      // Define object to hold tech data for state
      let techCount = {};

      projectData.forEach((project) => {
        const techArray = project.tech.split(", ");
        techArray.forEach((tech, i) => {
          if (tech.includes("and ")) {
            const newTech = tech.replace("and ", "");
            return (techArray[i] = newTech);
          } else {
            return (techArray[i] = tech);
          }
        }, techArray);

        techArray.forEach((tech) => {
          if (!techCount.hasOwnProperty(tech)) {
            techCount[tech] = 1;
          } else {
            techCount[tech]++;
          }
        });
      });

      // define array to hold tech data for graph
      let newArr = [];

      if (Object.keys(techCount).length !== 0) {
        Object.entries(techCount).forEach(([key, value]) =>
          newArr.push({ tech: `${key}`, count: value })
        );
      }

      const descArr = newArr.sort((a, b) => {
        return b.count - a.count;
      });

      setMostUsed(descArr.slice(0, 5));
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
              "In my spare time, I can be found using the phone-a-friend approach to crossword puzzles."
            }
          />
        </div>

        <div className="skill-anchor" id="languages">
          <h2>Skills</h2>
          <div className="mobile-hide">
            <h3 className="less-flush web-edge">Most Used Languages & Frameworks</h3>
            <Graph mostUsed={mostUsed} />
          </div>
          <div id="lang-specs">
            <Tech
              head={"Tech Stack"}
              body={
                "Axios, C#, CSS3, EJS, Express.js, JavaScript, MongoDB, Mongoose, MySQL, Next.js, Node.js, PostgreSQL, Python, Public APIs, React.js, Redux, Redux Thunk, Sequelize, SQL, Socket.IO, TypeScript, and HTML5"
              }
            />
            <Tech
              head={"Misc. Know-How"}
              body={
                "Adobe Creative Suite, Canva, Cargo, Figma, GitHub, Google Analytics, Heroku, NationBuilder, Netlify, Next.js, Postman, Pygame, Squarespace, Vercel, and WordPress"
              }
            />
          </div>
        </div>
        <div className="project-anchor" id="projects">
          <h2>Projects</h2>
          {projects.map((project, i) => {
            return (
              <div key={i.toString()}>
                {project.display && (
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
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
