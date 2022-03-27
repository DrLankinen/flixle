import React, { useEffect, useState, useCallback } from "react";
import { Guess } from "./Game";
import MOVIE_NAMES_JSON from "./movie_names.json";

const SORTED_MOVIE_NAMES = MOVIE_NAMES_JSON.sort();
let getOptions: ReturnType<typeof setTimeout> | null = null;

interface Props {
  // eslint-disable-next-line no-unused-vars
  addGuess: (newGuess: Guess) => void;
  motdIndex: number;
}

function Dropdown(props: Props) {
  const { addGuess, motdIndex } = props;

  const [inputText, setInputText] = useState("");
  const [selectedDropdown, setSelectedDropdown] = useState(0);
  const [dropdownOptions, setDropdownOptions] = useState<string[] | null>([]);

  const makeGuess = useCallback(async (overrideSelected?: number) => {
    if (dropdownOptions && dropdownOptions.length) {
      const guess = dropdownOptions[overrideSelected ?? selectedDropdown];
      const res = await fetch(
        `/api/hello?guess=${guess}&motdIndex=${motdIndex}`
      );
      console.log("res.status:", res.status);
      if (res.status == 403) {
        throw Error("Error making guess");
      }
      const data: Omit<Guess, "guess"> = await res.json();
      addGuess({ guess, ...data });
      setInputText("");
    }
  }, [dropdownOptions, selectedDropdown, addGuess, motdIndex]);

  useEffect(() => {
    const keylistener = (e: KeyboardEvent) => {
      if (!inputText.length) {
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedDropdown((prevVal) => Math.max(0, prevVal - 1));
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedDropdown((prevVal) =>
          Math.min(
            dropdownOptions ? dropdownOptions.length - 1 : 0,
            prevVal + 1
          )
        );
      }
      if (e.key === "Enter") {
        e.preventDefault();
        makeGuess();
      }
    };

    document.addEventListener("keydown", keylistener);
    return () => document.removeEventListener("keydown", keylistener);
  }, [dropdownOptions, inputText.length, makeGuess]);

  useEffect(() => {
    setInputText(inputText);
    if (!inputText) {
      setDropdownOptions([]);
    } else {
      if (getOptions) {
        clearTimeout(getOptions);
      }
      getOptions = setTimeout(() => {
        const filter = (name: string) =>
          name.toLowerCase().includes(inputText.toLowerCase());
        const filteredNames = SORTED_MOVIE_NAMES.filter(filter);
        setSelectedDropdown(0)
        setDropdownOptions(filteredNames.length ? filteredNames : null);
      }, 200);
    }
  }, [inputText]);

  return (
    <div className="dropdown">
      <input
        className="movie-input"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setInputText(e.target.value)
        }
        value={inputText}
      />
      <div
        className="dropdown-content"
        style={inputText.length ? { display: "block" } : undefined}
      >
        {dropdownOptions ? (
          dropdownOptions.map((text, index) => (
            <div
              key={text}
              onClick={() => {
                setSelectedDropdown(index)
                makeGuess(index)
              }}
              className="selectable"
              style={
                selectedDropdown === index
                  ? { backgroundColor: "red" }
                  : undefined
              }
            >
              {text}
            </div>
          ))
        ) : (
          <div>No matches</div>
        )}
      </div>
    </div>
  );
}

export default Dropdown;
