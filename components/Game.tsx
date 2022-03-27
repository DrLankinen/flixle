import { useState, useEffect, useCallback } from "react";
import { CorrectData } from "../pages/api/hello";
import Dropdown from "./Dropdown";
import Modal from "simple-react-modal";
import Image from "next/image";
import closeIcon from "/images/close-icon.svg";
import MOVIE_OF_THE_DAY_NAMES from "../pages/api/dailies.json";

function getRandomInt() {
  return Math.floor(Math.random() * MOVIE_OF_THE_DAY_NAMES.length);
}

export interface Guess {
  guess: string;
  correct: boolean;
  properties: CorrectData;
}

const GUESSES_KEY = "guesses";
const MOTD_KEY = "motd";

function Game() {
  const [guesses, setGuesses] = useState<Guess[]>(() => {
    // Load guesses from local storage
    if (typeof window !== "undefined") {
      const storedGuesses = localStorage.getItem(GUESSES_KEY);
      if (!storedGuesses) {
        return [];
      }
      return JSON.parse(storedGuesses);
    }
    return [];
  });
  const [isCorrectGuessModalOpen, setIsCorrectGuessModalOpen] = useState(false);

  useEffect(() => {
    // store guesses to local storage
    if (typeof window !== "undefined") {
      localStorage.setItem(GUESSES_KEY, JSON.stringify(guesses));
    }
    const guessedCorrectly = guesses.some((guess) => guess.correct);
    if (guessedCorrectly) {
      setIsCorrectGuessModalOpen(true);
    }
  }, [guesses]);

  const [motdIndex, setMotdIndex] = useState(() => {
    // Load motd from local storage
    if (typeof window !== "undefined") {
      const storedMotd = localStorage.getItem(MOTD_KEY);
      if (!storedMotd) {
        return getRandomInt();
      }
      return parseInt(storedMotd);
    }
    return getRandomInt();
  });

  useEffect(() => {
    // store motd to local storage
    if (typeof window !== "undefined") {
      localStorage.setItem(MOTD_KEY, motdIndex.toString());
    }
  }, [motdIndex]);

  const resetGame = useCallback(() => {
    setMotdIndex(getRandomInt());
    setGuesses([]);
  }, []);

  const correctGuess = guesses.find((guess) => guess.correct);

  return (
    <>
      <Modal
        show={isCorrectGuessModalOpen}
        containerStyle={{
          backgroundColor: "#1a1a1a",
          maxWidth: 700,
          maxHeight: 500,
          width: "90%",
          height: "90%",
          padding: 30,
        }}
        closeOnOuterClick
        onClose={() => setIsCorrectGuessModalOpen(false)}
      >
        <div className="game-complete-modal">
          <h4 className="modal-header">
            You guessed the flixle, {correctGuess?.guess}! 🎉
          </h4>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => setIsCorrectGuessModalOpen(false)}
          >
            <Image src={closeIcon} loading="lazy" width="24" alt="close icon" />
          </div>
        </div>
      </Modal>

      {!correctGuess && guesses.length < 6 && (
        <Dropdown
          addGuess={(newGuess: Guess) =>
            setGuesses((prev) => [newGuess, ...prev])
          }
          motdIndex={motdIndex}
        />
      )}

      {(guesses.length >= 6 || !!correctGuess) && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button
            onClick={resetGame}
            style={{ color: "orange", backgroundColor: "blue" }}
          >
            Next Flixle
          </button>
          {!correctGuess && (
            <p>Correct anwer is: {MOVIE_OF_THE_DAY_NAMES[motdIndex]}</p>
          )}
        </div>
      )}

      <div className="guesses-section wf-section">
        {guesses.map(({ guess, correct, properties }, index) => {
          const {
            director: directorData,
            cast: castData,
            year: yearData,
            genre: genreData,
            imdb: imdbData,
            rating: ratingData,
          } = properties;
          const [director, isDirectorCorrect] = directorData;
          const [cast, isCastCorrect] = castData;
          const [year, [yearDirection, yearCorrectness]] = yearData;
          const [genre, isGenreCorrect] = genreData;
          const [imdb, [imdbDirection, imdbCorrectness]] = imdbData;
          const [rating, ratingCorrectness] = ratingData;
          return (
            <div className="guess" key={guess + index}>
              <div
                id="w-node-_7ad89293-b70f-15e1-583c-121336bd3f8a-f5768476"
                className="movie-title"
              >
                <div className="text-block">
                  {correct ? "🎉" : null} {guesses.length - index}/6:{" "}
                  {correct ? <strong>{guess}</strong> : guess}{" "}
                  {correct ? "🎉" : null}
                </div>
              </div>
              <div className="w-layout-grid grid">
                {/* Director */}
                <div
                  id="w-node-ffcbff95-0bd8-f902-a8be-0fd3fd6ac3ec-f5768476"
                  className={`category ${isDirectorCorrect ? "correct" : ""}`}
                >
                  <div className="category-name">Director</div>
                  <div className="category-value">{director.join(", ")}</div>
                </div>
                {/* Cast */}
                <div
                  id="w-node-_57470e0f-357c-6751-b1f7-45dbde1615b3-f5768476"
                  className={`category ${isCastCorrect ? "correct" : ""}`}
                >
                  <div className="category-name">Cast</div>
                  <div className="category-value">{cast.join(", ")}</div>
                </div>
                {/* Genre */}
                <div
                  id="w-node-_9781beff-9060-3a32-6f64-50d8331a6d85-f5768476"
                  className={`category ${isGenreCorrect ? "correct" : ""}`}
                >
                  <div className="category-name">Genre</div>
                  <div className="category-value">{genre.join(", ")}</div>
                </div>
                {/* Year */}
                <div
                  id="w-node-_1449354b-fb1d-85c4-40fb-f39fc5e93ff9-f5768476"
                  className={`category ${yearCorrectness === "CORRECT"
                    ? "correct"
                    : yearCorrectness === "CLOSE"
                      ? "close"
                      : ""
                    }`}
                >
                  <div className="category-name">Year</div>
                  <div className="category-value">
                    {year}{" "}
                    {yearDirection === "UP"
                      ? "↑"
                      : yearDirection === "DOWN"
                        ? "↓"
                        : ""}
                  </div>
                </div>
                {/* iMDB */}
                <div
                  id="w-node-dbe059b9-edf8-3e9d-0f10-2507a7796cba-f5768476"
                  className={`category ${imdbCorrectness === "CORRECT"
                    ? "correct"
                    : imdbCorrectness === "CLOSE"
                      ? "close"
                      : ""
                    }`}
                >
                  <div className="category-name">iMDB</div>
                  <div className="category-value">
                    {imdb}{" "}
                    {imdbDirection === "UP"
                      ? "↑"
                      : imdbDirection === "DOWN"
                        ? "↓"
                        : ""}
                  </div>
                </div>
                {/* Rating */}
                <div
                  id="w-node-_7e6c412a-4a97-706a-7709-ddb318e41286-f5768476"
                  className={`category ${ratingCorrectness === "CORRECT"
                    ? "correct"
                    : ratingCorrectness === "CLOSE"
                      ? "close"
                      : ""
                    }`}
                >
                  <div className="category-name">Film Rating</div>
                  <div className="category-value">{rating}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Game;
