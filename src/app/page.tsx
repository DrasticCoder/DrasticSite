import Link from 'next/link';
import './landing.css';

export default function Home() {
  return (
    <main className="drastic-landing">
      <h1>🧱 DrasticSite</h1>
      <p className="tagline">
        A *very serious* place to throw your random HTML and watch it live...
        instantly.
      </p>

      <div className="section">
        <h2>🚀 What is this?</h2>
        <p>
          DrasticSite is a free single-page HTML hoster. No login. No ads. No
          soul. Paste code. Get a URL. That&apos;s it.
        </p>
      </div>

      <div className="section">
        <h2>🛠️ Currently Cooking...</h2>
        <ul>
          <li>🧵 CLI tool – because real devs use terminals</li>
          <li>
            📁 File uploads – for your beautiful <code>.html</code> masterpieces
          </li>
        </ul>
      </div>

      <div className="section">
        <h2>🧪 Future BS</h2>
        <ul>
          <li>⏳ Page expiration – we all fade eventually</li>
          <li>🧼 Delete your stuff – or don&apos;t, I don&apos;t care</li>
          <li>🧩 Sandboxed HTML – your scripts stay in their little jail</li>
          <li>🔐 Protected pages – secrets? shady stuff? we got you (maybe)</li>
        </ul>
      </div>

      <div className="section">
        <h2>🔗 Your Site?</h2>
        <p>
          <code>
            {typeof window !== 'undefined'
              ? `${window.location.hostname}/<your-page>`
              : 'in.drasticcoder.in/<your-page>'}
          </code>
          <br />
          You&apos;re welcome.
        </p>
      </div>

      <div className="get-started-container">
        <Link href="/form" className="get-started-btn">
          Get Started
        </Link>
      </div>

      <footer>
        <p>
          Made by{' '}
          <Link href="https://drasticcoder.in" target="_blank">
            drasticcoder
          </Link>{' '}
          😎
        </p>
      </footer>
    </main>
  );
}
