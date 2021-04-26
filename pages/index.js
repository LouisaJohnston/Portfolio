import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Louisa Johnston</title>
        <link rel="icon" href="/portfolio_favicon_squareheavy.png" />
      </Head>

      <h1>Hello!</h1>
      <p>I am a software engineer specializing in front-end 
        development with a particular interest in ventures 
        with an orientation towards social equity and the arts. 
        
        I am passionate about breaking problems down into their 
        smallest parts in order to build successful interventions. 
        My background in nonprofit marketing has taught me the 
        value of metrics-driven work, creative workarounds, and 
        constructing projects from the user’s perspective.

        In my spare time, I enjoy caring for my brood of houseplants, 
        an inordinate amount of crossword puzzles, and making my friends 
        and family cringe at my puns.
      </p>
    </div>
  )
}
