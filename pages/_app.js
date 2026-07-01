import '../styles/globals.css'
import { Analytics } from '@vercel/analytics/next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
      <Analytics />
    </>
  )
}
