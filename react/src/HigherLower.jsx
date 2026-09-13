import { useState } from "react";
import { pickRandomNumber } from "./gameData";
import { formatTime } from "./timeUtils";

function HigherLower({ onBack }) {
  // which page we're on: "start" or "play"
  const [screen, setScreen] = useState("start");

  // the highest number the secret number could be
  const [maxNumber, setMaxNumber] = useState(100);

  // the number the player is trying to guess
  const [secretNumber, setSecretNumber] = useState(null);

  // what's currently typed in the guess box
  const [guess, setGuess] = useState("");

  // the hint message shown to the player
  const [message, setMessage] = useState("");

  // how many guesses the player has made this round
  const [guessCount, setGuessCount] = useState(0);

  // true once the player has found the secret number
  const [isSolved, setIsSolved] = useState(false);

  // when the current round started, and how long it took once solved
  const [startTime, setStartTime] = useState(null);
  const [completionTime, setCompletionTime] = useState(null);

  // runs when the player presses "Start Game"
  function handleStart() {
    setSecretNumber(pickRandomNumber(maxNumber));
    setGuess("");
    setMessage(`Guess a number between 1 and ${maxNumber}`);
    setGuessCount(0);
    setIsSolved(false);
    setCompletionTime(null);
    setStartTime(Date.now());
    setScreen("play");
  }

  // runs when the player presses "Guess"
  function handleGuessSubmit() {
    if (guess === "") {
      setMessage("Type a number first.");
      return;
    }

    const guessedNumber = Number(guess);
    setGuessCount(guessCount + 1);

    if (guessedNumber === secretNumber) {
      const elapsed = Date.now() - startTime;
      setCompletionTime(formatTime(elapsed));
      setMessage(`Correct! It was ${secretNumber}.`);
      setIsSolved(true);
    } else if (guessedNumber < secretNumber) {
      setMessage("Go higher");
    } else {
      setMessage("Go lower");
    }

    setGuess("");
  }

  // goes back to this game's own start page (to change the range)
  function handleBackToStart() {
    setScreen("start");
    setMessage("");
    setCompletionTime(null);
  }

  if (screen === "start") {
    return (
      <div className="start-screen">
        <h1 className="game-title">Higher or Lower</h1>
        <hr />
        <div className="start-options">
          <label htmlFor="max-input">Highest number to pick from</label>
          <input
            id="max-input"
            type="number"
            min="2"
            value={maxNumber}
            onChange={(event) => setMaxNumber(Number(event.target.value))}
          />
          <button className="btn-primary" onClick={handleStart}>
            Start Game
          </button>
          <button className="btn-secondary" onClick={onBack}>
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-bar">
        <p>{message}</p>

        {!isSolved && (
          <div className="dropdown-row">
            <input
              type="number"
              value={guess}
              onChange={(event) => setGuess(event.target.value)}
            />
          </div>
        )}

        <div className="button-row">
          {!isSolved && (
            <button className="btn-primary" onClick={handleGuessSubmit}>
              Guess
            </button>
          )}
          <button className="btn-secondary" onClick={handleBackToStart}>
            Play Again
          </button>
          <button className="btn-secondary" onClick={onBack}>
            Menu
          </button>
        </div>

        <p>Guesses used: {guessCount}</p>
        {completionTime && <p className="result">Time: {completionTime}</p>}
      </div>
    </div>
  );
}

export default HigherLower;