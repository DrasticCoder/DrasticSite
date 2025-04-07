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
      <img src="/404.svg" alt="Not Found" />
      <h1>404 - Page Not Found</h1>
      <p>
        Oops, looks like you’ve wandered off the grid. <br />
        DrasticSite is a single-page HTML hoster built for free souls. <br />
        <a href="/">Go back home</a> and try again.
      </p>
    </div>
  );
}
