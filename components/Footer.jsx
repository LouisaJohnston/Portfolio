export default function Footer() {
  return (
    <div id="footer">
      <div id="personal">
        <h2 className="flush-foot">Louisa Johnston</h2>
        <p className="flush-foot">San Francisco, CA</p>
      </div>
      <div id="contact">
        <a
          href="mailto:louisa.latham.johnston@gmail.com?subject=Hello!"
          className="block"
        >
          Send an Email
        </a>

        <a
          href="https://github.com/LouisaJohnston/Portfolio"
          target="_blank"
          rel="noopener noreferrer"
        >
          Portfolio Repo
        </a>
      </div>
    </div>
  );
}
