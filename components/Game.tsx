import { useState, useEffect } from "react";
import { CorrectData } from "../pages/api/hello";
import Dropdown from "./Dropdown";

export interface Guess {
  guess: string;
  correct: boolean;
  properties: CorrectData;
}

const date = new Date();
const guessesKey = `guesses_${date.getDate()}-${
  date.getMonth() + 1
}-${date.getFullYear()}`;

function Game() {
  const [guesses, setGuesses] = useState<Guess[]>(() => {
    // Load guesses from local storage
    if (typeof window !== "undefined") {
      const storedGuesses = localStorage.getItem(guessesKey);
      if (!storedGuesses) {
        return [];
      }
      return JSON.parse(storedGuesses);
    }
    return [];
  });

  useEffect(() => {
    // store guesses to local storage
    if (typeof window !== "undefined") {
      localStorage.setItem(guessesKey, JSON.stringify(guesses));
    }
  }, [guesses]);

  const guessedCorrectly = guesses.some((guess) => guess.correct);

  return (
    <>
      {!guessedCorrectly && guesses.length < 6 && (
        <Dropdown
          addGuess={(newGuess: Guess) =>
            setGuesses((prev) => [newGuess, ...prev])
          }
        />
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
                  className={`category ${
                    yearCorrectness === "CORRECT"
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
                  className={`category ${
                    imdbCorrectness === "CORRECT"
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
                  className={`category ${
                    ratingCorrectness === "CORRECT"
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
