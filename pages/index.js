import Head from "next/head";
import { useState, useEffect } from "react";
import IntroParagraph from "../components/IntroParagraph";
import Tech from "../components/Tech";
import projectsJSON from "../projects.json";
import Graph from "../components/Graph";

export default function Index() {
  const [projects, setProjects] = useState([]);
  const [techProps, setTechProps] = useState([]);
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
      let objArr = [];
      let totalArr = [];
      if (Object.keys(techCount).length !== 0) {
        Object.entries(techCount).forEach(([key, value]) => {
          objArr.push({ tech: `${key}`, count: value });
          totalArr.push(key);
        });
      }
      setTechProps(totalArr);
      const descArr = objArr.sort((a, b) => {
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
          content="Python, JavaScript, Django, SQL, GraphQL"
        />
        <meta name="author" content="Louisa Johnston" />
        <meta property="og:image" content="/LinkedInHead.png" />
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
              "I'm a San Francisco-based software engineer with a focus on backend development and five years experience working on enterprise software. I have particular interest in mission-driven projects and the arts."
            }
          />
          <IntroParagraph
            paragraph={
              "In my spare time, I can be found using the phone-a-friend approach to crossword puzzles or looking for birds."
            }
          />
        </div>

        <div className="skill-anchor" id="tech">
          <h2>Tech</h2>
          <div className="mobile-hide">
            <h3 className="less-flush web-edge">Most Used</h3>
            <Graph projects={projects} mostUsed={mostUsed} />
          </div>
          <div id="lang-specs">
            <Tech head={"Languages & Frameworks"} techProps={techProps} />
            <Tech
              head={"Misc. Know-How"}
              body={"Datadog, Sentry, and Adobe Creative Suite"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
