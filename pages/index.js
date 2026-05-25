import Head from "next/head";
import { useState, useEffect } from "react";
import IntroParagraph from "../components/IntroParagraph";
import Tech from "../components/Tech";
import projectsJSON from "../projects.json";
import GitHubContributions from "../components/GitHubContributions";

export default function Index() {
  const [techProps, setTechProps] = useState([]);
  const [githubData, setGithubData] = useState(null);

  useEffect(() => {
    try {
      const projectData = projectsJSON.projects;
      const techCount = {};
      projectData.forEach((project) => {
        const techArray = project.tech.split(", ");
        techArray.forEach((tech, i) => {
          if (tech.includes("and ")) techArray[i] = tech.replace("and ", "");
        });
        techArray.forEach((tech) => {
          techCount[tech] = (techCount[tech] || 0) + 1;
        });
      });
      setTechProps(Object.keys(techCount));
    } catch (err) {
      console.log(err);
    }

    fetch("/api/github-contributions")
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setGithubData(d);
      })
      .catch(() => {});
  }, []);

  const languages = githubData?.languages ?? [];
  const maxBytes = languages[0]?.size || 1;
  const totalBytes = languages.reduce((s, l) => s + l.size, 0);

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
          <div id="lang-specs">
            <Tech head={"Languages & Frameworks"} techProps={techProps} />
            <Tech
              head={"Tools"}
              body={"Datadog, Sentry, and Adobe Creative Suite"}
            />
          </div>
          {languages.length > 0 && (
            <>
              <h3 style={{ paddingTop: "36px" }}>Most Used Languages</h3>
              <div className="graph-wrapper">
                <div className="graph">
                  <div className="bar-lines-container">
                    {languages.map((lang, i) => (
                      <div key={i} className="bar-holder lang-bar-holder">
                        <div
                          style={{ width: `${(lang.size / maxBytes) * 100}%` }}
                          className="bar"
                        >
                          <span className="graphLabel">{lang.name} | </span>
                          {((lang.size / totalBytes) * 100).toFixed(1)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="skill-anchor" id="github">
          <h2>GitHub Activity Across All Profiles</h2>
          <GitHubContributions contributions={githubData?.contributions} />
        </div>
      </div>
    </div>
  );
}
