import Image from 'next/image'

export default function Bot() {
    return (
        <div>
          <ul className="less-flush">
            <li>Built a version of Boggle using Python and Pygame to render a 4x4 grid from a two-dimensional array of randomized letters corresponding to real Boggle dice</li>
            <li>Allowed users to check whether a given word exists in adjacent grid tiles (up, down, diagonally, forwards, and backwards)</li>
            <li>Inserted dictionary information into a trie data structure to check against user input and optimize the project's time complexity</li>
          </ul>
          <a href="https://github.com/LouisaJohnston/botNoggle" target="_blank" className="repo less-flush offset block det-link">Bot Noggle Repo</a>
          <div id="bot-play" className="offset">
            <div id="bot-border">
              <Image 
                src='/bot/gameplay.png'
                alt='Bot Noggle Gameplay'
                width={550}
                height={280}
                label="Bot play"
              />
            </div>
          </div>
        </div>
    )
}