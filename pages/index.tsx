import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Game from "../components/Game";
import Modal from "simple-react-modal";
import Image from "next/image";
import closeIcon from "/images/close-icon.svg";
import sampleFlixle from "/images/sample-flixle.png";

const Home: NextPage = () => {
  const [isHowToPlayModalOpen, setIsHowToPlayModalOpen] = useState(false);
  return (
    <div>
      <Modal
        show={isHowToPlayModalOpen}
        containerStyle={{
          backgroundColor: "#1a1a1a",
          maxWidth: 700,
          maxHeight: 570,
          width: "90%",
          height: "90%",
          padding: 30
        }}
        closeOnOuterClick
        onClose={() => setIsHowToPlayModalOpen(false)}
      >
        <div className="game-complete-modal">
          <h4 className="modal-header">How to play</h4>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => setIsHowToPlayModalOpen(false)}
          >
            <Image src={closeIcon} loading="lazy" width="24" alt="close icon" />
          </div>
        </div>
        <div className="modal-text">
          Guess the movie in six tries or less.
          <br />
          <br />
          Each guess must be a valid movie. Press enter to submit your guess.
          <br />
          <br />
          After each guess, the color of the categories will change to show how
          close your guess was to the movie of the day.
        </div>
        <div className="modal-text">Example - Interstellar</div>
        <div className="modal-text">Guess: Dark Night Rises</div>
        <Image src={sampleFlixle} loading="lazy" alt="sample game" />
      </Modal>

      <Head>
        <title>Flixle</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link href="favicon.ico" rel="shortcut icon" type="image/x-icon" />
        <link href="webclip.png" rel="apple-touch-icon" />
      </Head>

      <body className="body">
        <div
          onClick={() => setIsHowToPlayModalOpen(true)}
          style={{
            cursor: "pointer",
            width: "fit-content",
            marginLeft: "auto",
            paddingTop: 15,
            paddingRight: 20
          }}
        >
          How to play?
        </div>
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
