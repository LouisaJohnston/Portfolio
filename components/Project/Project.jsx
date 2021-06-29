export default function Project() {
    const [showDetails, setShowDetails] = useState(false)

    const handleClick = () => {
        setShowDetails(!showDetails)
    }

    return (
        <div className="project-box">
            <h3 className="less-flush">
                <a href="https://louisajohnston.github.io/" target="_blank">
                Word-cross’d Puzzler</a>
            </h3>
                <h4 className="italic flush">JavaScript, CSS, and HTML</h4>
            <div>
                { showPuzzler ? <Puzzler /> : null }
                <div className= "details" onClick={ puzzlerClick }>
                    { showPuzzler ? <a>Hide Details</a> : <a>Show Project Details</a> }
                </div>
            </div>
        </div>
    )
};