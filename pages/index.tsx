import type { NextPage } from "next";
import Head from "next/head";
import Game from "../components/Game";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Flixle</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link href="favicon.ico" rel="shortcut icon" type="image/x-icon" />
        <link href="webclip.png" rel="apple-touch-icon" />
      </Head>

      <body className="body">
        <div className="logo-section wf-section">
          <div className="logo-div">
            <h1 className="flixle-logo">Flixle</h1>
            <h2 className="flixle-slogan">Can you guess today&#x27;s movie?</h2>
          </div>
        </div>
        <Game />
        <div className="footer-section wf-section">
          <div className="footer-text">
            2022 - An experiment by{" "}
            <a
              href="http://twitter.com/some_labs"
              target="_blank"
              className="link"
              rel="noreferrer"
            >
              Some Labs
            </a>
          </div>
        </div>
      </body>
    </div>
  );
};

export default Home;
