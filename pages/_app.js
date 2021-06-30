import '../styles/globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { MemoryRouter } from 'react-router-dom'

export default function App({ Component, pageProps }) {
  return (
    <MemoryRouter>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </MemoryRouter>
  ) 
}
