// GITHUB_TOKEN must belong to GITHUB_USER for private contribution data.
// GITHUB_USER_2 is optional — uses the same token to fetch public contributions only.
import { combineCalendars, yearWindows } from '../../lib/contributions';

const GH_GRAPHQL = 'https://api.github.com/graphql';

// createdAt tells us how far back to page; contributionsCollection is capped at
// one year per query, so full history needs one windowed query per year.
const META_QUERY = `
  query($username: String!) {
    user(login: $username) {
      createdAt
    }
  }
`;

const CALENDAR_QUERY = `
  query($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
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

// Fetch a user's entire contribution history as an array of per-year calendars,
// or null if the user doesn't exist.
async function fetchUserHistory(username, token) {
  const meta = await ghFetch(META_QUERY, { username }, token);
  if (!meta) return null;
  const windows = yearWindows(meta.createdAt);
  return Promise.all(
    windows.map((w) =>
      ghFetch(CALENDAR_QUERY, { username, from: w.from, to: w.to }, token).then(
        (u) => u.contributionsCollection.contributionCalendar
      )
    )
  );
}

export default async function handler(req, res) {
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USER;
  const username2 = process.env.GITHUB_USER_2;

  if (!token || !username) {
    return res.status(500).json({ error: 'GitHub env vars not configured' });
  }

  try {
    const requests = [fetchUserHistory(username, token)];
    if (username2) requests.push(fetchUserHistory(username2, token));

    const [h1, h2] = await Promise.all(requests);

    if (!h1) throw new Error(`GitHub user "${username}" not found`);

    const contributions = combineCalendars(h2 ? [h1, h2] : [h1]);

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json({ contributions });
  } catch (err) {
    console.error('GitHub contributions error:', err);
    return res.status(500).json({ error: err.message });
  }
}
