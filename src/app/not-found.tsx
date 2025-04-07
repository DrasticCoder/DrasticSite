import Image from 'next/image';
import Link from 'next/link';
export default function NotFound() {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '3rem',
        fontFamily: 'Courier New, monospace',
        background: '#fafafa',
      }}
    >
      <Image src="/404.svg" alt="Not Found" />
      <h1>404 - Page Not Found</h1>
      <p>
        Oops, looks like you’ve wandered off the grid. <br />
        DrasticSite is a single-page HTML hoster built for free souls. <br />
        <Link href="/">Go back home</Link> and try again.
      </p>
    </div>
  );
}
