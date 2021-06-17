import FlickCarousel from "./FlickCarousel"

export default function Flick() {
    return (
        <div>
            <ul className="less-flush">
                <li>Created a web app using node.js and Express.js with the ability for users to create an account or login with encrypted cookie storage and password hashing</li>
                <li>Applied EJS templates and Axios to render information from a third-party film API and allow users to save movies to personal lists</li>
                <li>Stored multiple user inputs (login information and movie comments/reviews) as database information fields through PostgreSQL with the ability for users to update them directly</li>
            </ul>
            <a href="https://github.com/LouisaJohnston/Flick_Picks" target="_blank" className="repo inline less-flush offset">Flick Picks Repo</a>
            <FlickCarousel />
        </div>
    )
}