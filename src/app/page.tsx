import Link from 'next/link';
import './landing.css';

export default function Home() {
  return (
    <main className="drastic-landing">
      <h1>🧱 DrasticSite</h1>
      <p className="tagline">
        A <span className="highlight">very serious</span> place to throw your
        random HTML and watch it live… instantly.
      </p>

      <div className="section">
        <h2>What is this?</h2>
        <p>
          DrasticSite is a free single-page HTML hoster. No login, no ads – just
          paste your code and get a URL.
        </p>
      </div>

      <div className="section">
        <h2>Currently Cooking</h2>
        <ul>
          <li>CLI tool – for those who love the command line</li>
          <li>
            File uploads – easily share your <code>.html</code> masterpieces
          </li>
        </ul>
      </div>

      <div className="section">
        <h2>Future Enhancements</h2>
        <ul>
          <li>Page expiration for temporary content</li>
          <li>Option to delete your content</li>
          <li>Sandboxed HTML for enhanced security</li>
          <li>Protected pages for private sharing</li>
        </ul>
      </div>

      <div className="section">
        <h2>Your Site</h2>
        <p>
          <code>
            {typeof window !== 'undefined'
              ? `<your-page>.${window.location.hostname}/`
              : '<your-page>.site.drasticcoder.in/'}
          </code>
          <br />
          It’s that simple.
        </p>
      </div>

      <div className="get-started-container">
        <Link href="/form" className="get-started-btn">
          ⚡ Launch Now
        </Link>
        <Link href="/editor" className="online-editor-btn">
          ✏️ Open Online Editor
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
