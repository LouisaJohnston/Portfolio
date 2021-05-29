import Link from 'next/link'

export default function Footer() {
    return (
        <div id='footer'>
            <div id='my-deets'>
                <h2 class ="flush-top">Louisa Johnston</h2>
                <p class ="flush-top">Pronouns: she, her, hers</p>
                <p class ="flush-top">Oakland, CA</p>
            </div>
            <div id='contact-deets'>
                <Link href='mailto:louisa.latham.johnston@gmail.com?subject=Hello!'>
                    <a class="block">Send an Email</a>
                </Link>

                <Link href='/LouisaJohnston_Resume.pdf'>
                    <a target='_blank' download>Download Resume</a>
                </Link>
            </div>
        </div>
    )
}