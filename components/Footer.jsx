import Link from 'next/link'

export default function Footer() {
    return (
        <div id='footer'>
            <div id='personal'>
                <h2 className ="flush-foot">Louisa Johnston</h2>
                <p className ="flush-foot">Pronouns: she, her, hers</p>
                <p className ="flush-foot">Oakland, CA</p>
            </div>
            <div id='contact'>
                <Link href='mailto:louisa.latham.johnston@gmail.com?subject=Hello!'>
                    <a className="block">Send an Email</a>
                </Link>

                <Link href='/LouisaJohnston_Resume.pdf'>
                    <a target='_blank' download>Download Resume</a>
                </Link>
            </div>
        </div>
    )
}