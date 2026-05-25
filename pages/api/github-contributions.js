// GITHUB_TOKEN must belong to GITHUB_USER for private contribution + repo data.
// GITHUB_USER_2 is optional — uses the same token to fetch public contributions only.
const GH_GRAPHQL = 'https://api.github.com/graphql';

const FULL_QUERY = `
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

const CALENDAR_QUERY = `
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
    }
  }
`;

async function ghFetch(query, variables, token) {
  const res = await fetch(GH_GRAPHQL, {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data.user;
}

function mergeCalendars(cal1, cal2) {
  const dayMap = {};
  [cal1, cal2].forEach((cal) => {
    cal.weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        dayMap[day.date] = (dayMap[day.date] || 0) + day.contributionCount;
      });
    });
  });

  return {
    total: Object.values(dayMap).reduce((s, c) => s + c, 0),
    weeks: cal1.weeks.map((week) => ({
      days: week.contributionDays.map((day) => ({
        date: day.date,
        count: dayMap[day.date] || 0,
      })),
    })),
  };
}

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
  return Object.values(langMap).sort((a, b) => b.size - a.size).slice(0, 3);
}

export default async function handler(req, res) {
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USER;
  const username2 = process.env.GITHUB_USER_2;

  if (!token || !username) {
    return res.status(500).json({ error: 'GitHub env vars not configured' });
  }

  try {
    const requests = [ghFetch(FULL_QUERY, { username }, token)];
    if (username2) requests.push(ghFetch(CALENDAR_QUERY, { username: username2 }, token));

    const [u1, u2] = await Promise.all(requests);

    if (!u1) throw new Error(`GitHub user "${username}" not found`);

    const cal1 = u1.contributionsCollection.contributionCalendar;
    const contributions = u2
      ? mergeCalendars(cal1, u2.contributionsCollection.contributionCalendar)
      : {
          total: cal1.totalContributions,
          weeks: cal1.weeks.map((week) => ({
            days: week.contributionDays.map((day) => ({
              date: day.date,
              count: day.contributionCount,
            })),
          })),
        };

    const languages = aggregateLanguages(u1.repositories.nodes);

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json({ contributions, languages });
  } catch (err) {
    console.error('GitHub contributions error:', err);
    return res.status(500).json({ error: err.message });
  }
}
