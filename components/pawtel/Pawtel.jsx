export default function Pawtel() {
    return (
        <div>
            <ul className="less-flush">
                <li>Designed a full-stack MERN app using complex authorization routes allowing users to register as either a pet owner or a pet hotel owner to help pet owners connect with pet hotels</li>
                <li>Employed React components to render information from a local API pertaining to user-specific pets or hotels, depending on the authorization route, with the ability to update and delete data fields</li>
                <li>Saved user input through server-side Mongoose database using MongoDB</li>
            </ul>
            <a href="https://github.com/LouisaJohnston/Paw-tel" target="_blank" className="repo less-flush offset block">Paw-Tel Server-Side Repo</a>
            <a href="https://github.com/LouisaJohnston/pawtel-client" target="_blank" className="repo flush offset">Paw-Tel Client-Side Repo</a>
        </div>
    )
}