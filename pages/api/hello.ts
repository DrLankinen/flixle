import type { NextApiRequest, NextApiResponse } from "next";
import { Guess } from "../../components/Game";
import DATA_JSON from "./data.json";
import MOVIE_OF_THE_DAY_NAMES from "./dailies.json";

interface Data {
  director: string[];
  cast: string[];
  year: number;
  genre: string[];
  imdb: string;
  rating: string;
}
interface Json {
  [name: string]: Data;
}

type UP_DOWN_CORRECT = "UP" | "DOWN" | "CORRECT";
type CLOSE_FAR_CORRECT = "CLOSE" | "FAR" | "CORRECT";

export type CorrectData = {
  director: [string[], boolean];
  cast: [string[], boolean];
  year: [number, [UP_DOWN_CORRECT, CLOSE_FAR_CORRECT]];
  genre: [string[], boolean];
  imdb: [number, [UP_DOWN_CORRECT, CLOSE_FAR_CORRECT]];
  rating: [string, CLOSE_FAR_CORRECT];
};

const DATA: Json = DATA_JSON;

const intersection = (a: string[], b: string[]) =>
  a.filter((i) => b.includes(i));

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Omit<Guess, "guess"> | string>
) {
  const { guess, motdIndex: _motdIndex } = req.query;
  const motdIndex = parseInt(_motdIndex as string);

  const movieOfTheDayName = MOVIE_OF_THE_DAY_NAMES[motdIndex];
  const movieOfTheDayData = DATA[movieOfTheDayName];

  // TODO: remove as string and use body type to not have string[] as one option
  const guessedMovieData = DATA[guess as string] as Data;
  if (!guessedMovieData) {
    res.status(403).send("error");
    return;
  }

  const data: CorrectData = {
    director: [guessedMovieData["director"], true],
    cast: [guessedMovieData["cast"], true],
    year: [guessedMovieData["year"], ["CORRECT", "CORRECT"]],
    genre: [guessedMovieData["genre"], true],
    imdb: [parseFloat(guessedMovieData["imdb"]), ["CORRECT", "CORRECT"]],
    rating: [guessedMovieData["rating"], "CORRECT"],
  };

  const isCorrectGuess = guess === movieOfTheDayName;
  if (isCorrectGuess) {
    res.status(200).json({ correct: true, properties: data });
  } else {
    // director
    const directorIntersection = intersection(
      guessedMovieData["director"],
      movieOfTheDayData["director"]
    );
    if (directorIntersection.length) {
      data["director"][0] = directorIntersection;
      data["director"][1] = true;
    } else {
      data["director"][1] = false;
    }

    // cast
    const castIntersection = intersection(
      guessedMovieData["cast"],
      movieOfTheDayData["cast"]
    );
    if (castIntersection.length) {
      data["cast"][0] = castIntersection;
      data["cast"][1] = true;
    } else {
      data["cast"][1] = false;
    }

    // year
    const yearDiff = guessedMovieData["year"] - movieOfTheDayData["year"];
    if (yearDiff > 0) {
      data["year"][1] = ["DOWN", Math.abs(yearDiff) <= 3 ? "CLOSE" : "FAR"];
    } else if (yearDiff < 0) {
      data["year"][1] = ["UP", Math.abs(yearDiff) <= 3 ? "CLOSE" : "FAR"];
    } else {
      data["year"][1] = ["CORRECT", "CORRECT"];
    }

    // genre
    const genreIntersection = intersection(
      guessedMovieData["genre"],
      movieOfTheDayData["genre"]
    );
    if (genreIntersection.length) {
      data["genre"][0] = genreIntersection;
      data["genre"][1] = true;
    } else {
      data["genre"][1] = false;
    }

    // imdb
    const imdbDiff =
      parseFloat(guessedMovieData["imdb"]) -
      parseFloat(movieOfTheDayData["imdb"]);
    if (imdbDiff > 0) {
      data["imdb"][1] = ["DOWN", Math.abs(imdbDiff) <= 1 ? "CLOSE" : "FAR"];
    } else if (imdbDiff < 0) {
      data["imdb"][1] = ["UP", Math.abs(imdbDiff) <= 1 ? "CLOSE" : "FAR"];
    } else {
      data["imdb"][1] = ["CORRECT", "CORRECT"];
    }

    // rating
    const guessedRating = guessedMovieData["rating"];
    const targetRating = movieOfTheDayData["rating"];
    if (guessedRating === targetRating) {
      data["rating"][1] = "CORRECT";
    } else {
      let isClose = false;
      switch (guessedRating) {
        case "G":
          isClose = targetRating === "PG";
          break;
        case "PG":
          isClose = ["G", "PG-13"].includes(targetRating);
          break;
        case "PG-13":
          isClose = ["PG", "R"].includes(targetRating);
          break;
        case "R":
          isClose = targetRating === "PG-13";
          break;
        default:
          break;
      }
      data["rating"][1] = isClose ? "CLOSE" : "FAR";
    }

    res.status(200).json({ correct: false, properties: data });
  }
}
