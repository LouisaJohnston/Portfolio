export default function ProjectDetails({
    i,
    name,
    details,
    github,
    images    
}) {
    return(
        <div key={i}>
            <ul className="less-flush">
            {details.map((detail, i) => {
                return (
                    <li key={i}>{detail}</li>
                )
            })}
            </ul>
        <a href="https://github.com/LouisaJohnston/botNoggle" target="_blank" className="repo less-flush offset block det-link">Bot Noggle Repo</a>
        <div id="bot-play" className="offset">
          <div id="bot-border">
            {/* <Image 
              src='/bot/gameplay.png'
              alt='Bot Noggle Gameplay'
              width={550}
              height={280}
              label="Bot play"
            /> */}
          </div>
        </div>
      </div>
    )
}