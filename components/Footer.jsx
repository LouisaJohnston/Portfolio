import Link from 'next/link'

export default function Footer() {
    return (
        <div id='footer'>
            <div id='personal'>
                <h2 className ="flush-foot">Louisa Johnston</h2>
                <p className ="flush-foot">Oakland, CA</p>
                <p className ="flush-foot">She/Her/Hers</p>
            </div>
            <div id='contact'>
                <Link href='mailto:louisa.latham.johnston@gmail.com?subject=Hello!'>
                    <a className="block">Send an Email</a>
                </Link>

                <Link href='/LouisaJohnston_Resume.pdf'>
                    <a target='_blank' download className="block">Download Resume</a>
                </Link>

                <Link href='https://github.com/LouisaJohnston/Portfolio'>
                    <a target='_blank' download>Portfolio Repo</a>
                </Link>
            </div>
        </div>
    )
}