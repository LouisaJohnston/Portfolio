// GITHUB_TOKEN must belong to GITHUB_USER for private contribution data.
// GITHUB_USER_2 is optional — uses the same token to fetch public contributions only.
import { shapeCalendar, mergeCalendars } from '../../lib/contributions';

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

export default async function handler(req, res) {
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USER;
  const username2 = process.env.GITHUB_USER_2;

  if (!token || !username) {
    return res.status(500).json({ error: 'GitHub env vars not configured' });
  }

  try {
    const requests = [ghFetch(FULL_QUERY, { username }, token)];
    if (username2) requests.push(ghFetch(FULL_QUERY, { username: username2 }, token));

    const [u1, u2] = await Promise.all(requests);

    if (!u1) throw new Error(`GitHub user "${username}" not found`);

    const cal1 = u1.contributionsCollection.contributionCalendar;
    const contributions = u2
      ? mergeCalendars(cal1, u2.contributionsCollection.contributionCalendar)
      : shapeCalendar(cal1);

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json({ contributions });
  } catch (err) {
    console.error('GitHub contributions error:', err);
    return res.status(500).json({ error: err.message });
  }
}
