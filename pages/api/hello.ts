import type { NextApiRequest, NextApiResponse } from 'next'
import datajson from './data.json'

interface Data {
  "director": string[],
  "cast": string[],
  "year": number,
  "genre": string[],
  "imdb": number,
  "rating": string
}
interface Json {
  [name: string]: Data
}

type UP_DOWN_CORRECT = "UP" | "DOWN" | "CORRECT"
type CLOSE_FAR_CORRECT = "CLOSE" | "FAR" | "CORRECT"

type CorrectData = {
  "director"?: string[],
  "cast"?: string[],
  "year"?: [UP_DOWN_CORRECT, CLOSE_FAR_CORRECT],
  "genre"?: string[],
  "imdb"?: [UP_DOWN_CORRECT, CLOSE_FAR_CORRECT],
  "rating"?: [boolean, CLOSE_FAR_CORRECT]
}

const MOVIE_OF_THE_DAY_INDEX = 0

const DATA: Json = datajson
const MOVIE_OF_THE_DAY_NAME = (() => {
  const movieNames = Object.keys(DATA)
  return movieNames[MOVIE_OF_THE_DAY_INDEX]
})()
const MOVIE_OF_THE_DAY_DATA = (() => {
  const movieData = Object.values(DATA)
  return movieData[MOVIE_OF_THE_DAY_INDEX]
})()

const intersection = (a: string[], b: string[]) => (
  a.filter(i => b.includes(i))
)

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean, data?: CorrectData }>
) {
  const { guess } = req.query

  const isCorrectGuess = guess === MOVIE_OF_THE_DAY_NAME
  if (isCorrectGuess) {
    res.status(200).json({ success: true })
  } else {
    // TODO: remove as string and use body type to not have string[] as one option
    const guessedMovieData = DATA[guess as string] as Data
    if (!guessedMovieData) {
      res.status(200).json({ success: false })
      return
    }
    console.log('guessedMovieData', guessedMovieData)
    const data: CorrectData = {}

    // director
    const directorIntersection = intersection(guessedMovieData["director"], MOVIE_OF_THE_DAY_DATA["director"])
    if (directorIntersection.length) {
      data["director"] = directorIntersection
    }

    // cast
    const castIntersection = intersection(guessedMovieData["cast"], MOVIE_OF_THE_DAY_DATA["cast"])
    if (castIntersection.length) {
      data["cast"] = castIntersection
    }

    // year
    const yearDiff = guessedMovieData["year"] - MOVIE_OF_THE_DAY_DATA["year"]
    if (yearDiff > 0) {
      data["year"] = ["DOWN", Math.abs(yearDiff) <= 3 ? "CLOSE" : "FAR"]
    } else if (yearDiff < 0) {
      data["year"] = ["UP", Math.abs(yearDiff) <= 3 ? "CLOSE" : "FAR"]
    } else {
      data["year"] = ["CORRECT", "CORRECT"]
    }

    // genre
    const genreIntersection = intersection(guessedMovieData["genre"], MOVIE_OF_THE_DAY_DATA["genre"])
    if (genreIntersection.length) {
      data["genre"] = genreIntersection
    }

    // imdb
    const imdbDiff = guessedMovieData["imdb"] - MOVIE_OF_THE_DAY_DATA["imdb"]
    if (imdbDiff > 0) {
      data["imdb"] = ["DOWN", Math.abs(imdbDiff) <= 1 ? "CLOSE" : "FAR"]
    } else if (imdbDiff < 0) {
      data["imdb"] = ["UP", Math.abs(imdbDiff) <= 1 ? "CLOSE" : "FAR"]
    } else {
      data["imdb"] = ["CORRECT", "CORRECT"]
    }

    // rating
    const guessedRating = guessedMovieData["rating"]
    const targetRating = MOVIE_OF_THE_DAY_DATA["rating"]
    if (guessedRating === targetRating) {
      data["rating"] = [true, "CORRECT"]
    } else {
      let isClose = false
      switch (guessedRating) {
        case "G":
          isClose = targetRating === "PG"
          break
        case "PG":
          isClose = ["G", "PG-13"].includes(targetRating)
          break
        case "PG-13":
          isClose = ["PG", "R"].includes(targetRating)
          break
        case "R":
          isClose = targetRating === "PG-13"
          break
        default:
          break
      }
      data["rating"] = [false, isClose ? "CLOSE" : "FAR"]
    }

    res.status(200).json({ success: false, data })
  }
}
