// Token must belong to the queried user — required for private repo and contribution data.
const GH_GRAPHQL = 'https://api.github.com/graphql';

const QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
      repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
        nodes {
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
    }
  }
`;

function aggregateLanguages(repos) {
  const langMap = {};
  repos.forEach((repo) => {
    repo.languages.edges.forEach(({ size, node }) => {
      if (!langMap[node.name]) {
        langMap[node.name] = { name: node.name, color: node.color, size: 0 };
      }
      langMap[node.name].size += size;
    });
  });
  return Object.values(langMap).sort((a, b) => b.size - a.size).slice(0, 7);
}

export default async function handler(req, res) {
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USER;

  if (!token || !username) {
    return res.status(500).json({ error: 'GitHub env vars not configured' });
  }

  try {
    const response = await fetch(GH_GRAPHQL, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: QUERY, variables: { username } }),
    });

    if (!response.ok) throw new Error(`GitHub API error ${response.status}`);
    const json = await response.json();
    if (json.errors) throw new Error(json.errors[0].message);
    if (!json.data.user) throw new Error(`GitHub user "${username}" not found`);

    const { contributionsCollection, repositories } = json.data.user;
    const cal = contributionsCollection.contributionCalendar;

    const contributions = {
      total: cal.totalContributions,
      weeks: cal.weeks.map((week) => ({
        days: week.contributionDays.map((day) => ({
          date: day.date,
          count: day.contributionCount,
        })),
      })),
    };

    const languages = aggregateLanguages(repositories.nodes);

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json({ contributions, languages });
  } catch (err) {
    console.error('GitHub contributions error:', err);
    return res.status(500).json({ error: err.message });
  }
}
