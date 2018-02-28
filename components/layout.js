import Link from "next/link";
import Head from "next/head";

export default ({ children, title = "This is the default title", parentClassName="" }) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
        integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
        crossorigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="/static/style.css"
        crossorigin="anonymous"
      />
    </Head>
    <div className={`${parentClassName}`}>
      <header>
        <nav className="navbar">
          <div className="container">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <Link href="/">
                <a className="navbar-brand" href="/">Stellar Logo</a>
              </Link>
            </div>
            <div id="navbar" className="collapse navbar-collapse">
              <ul className="nav navbar-nav">
                <li><Link href="/"><a>Home</a></Link></li>
                <li><Link href="/get-link"><a>Get My Link</a></Link></li>
              </ul>
          </div>
          </div>
        </nav>
      </header>
      <div className="container">
        {children}
      </div>
      <footer>
        <div className="container">
          &copy; Copyrights 2018. All rights reserved.
        </div>
      </footer>
    </div>
  </div>
);
