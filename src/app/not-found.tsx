import Image from 'next/image';
import Link from 'next/link';
import NotFoundImage from '../../public/404.svg';

export default function NotFound() {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '3rem',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Courier New, monospace',
        background: '#fafafa',
      }}
    >
      <Image src={NotFoundImage} alt="Not Found" width={200} height={200} />
      <h1>404 - Page Not Found</h1>
      <p>
        Oops, looks like you&apos;ve wandered off the grid. <br />
        DrasticSite is a single-page HTML hosting platform built for free souls.{' '}
        <br />
        <Link href="/">Go back home</Link> and try again.
      </p>
    </div>
  );
}
