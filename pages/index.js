import Head from "next/head";
import { useState, useEffect } from "react";
import IntroParagraph from "../components/IntroParagraph";
import GitHubContributions from "../components/GitHubContributions";

export default function Index() {
  const [githubData, setGithubData] = useState(null);
  const [githubLoading, setGithubLoading] = useState(true);

  useEffect(() => {
    fetch("/api/github-contributions")
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setGithubData(d);
      })
      .catch(() => {})
      .finally(() => setGithubLoading(false));
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
              "I'm a San Francisco-based software engineer with particular interest in mission-driven projects and the arts."
            }
          />
          <IntroParagraph
            paragraph={
              "In my spare time, I can be found using the phone-a-friend approach to crossword puzzles or saying “hi!” to neighboorhood dogs."
            }
          />
        </div>

        <div className="skill-anchor" id="github">
          {/* The heading and caption share their lines with the month label and
              the arrows, so they're passed in rather than rendered here. */}
          <GitHubContributions
            heading="GitHub Activity"
            caption="as migratory birds"
            contributions={githubData?.contributions}
            loading={githubLoading}
          />
        </div>
      </div>
    </div>
  );
}
