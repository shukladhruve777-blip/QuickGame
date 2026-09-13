import { useState } from "react";
import { makeNumbers, shuffleNumbers } from "./gameData";
import { formatTime } from "./timeUtils";

function NumberMatch({ onBack }) {
  // which page we're on: "start" or "play"
  const [screen, setScreen] = useState("start");

  // how many numbers the player wants to play with
  const [count, setCount] = useState(3);

  // the list of numbers to pick from
  const [numbers, setNumbers] = useState([]);

  // the secret order the player is trying to guess
  const [secretOrder, setSecretOrder] = useState([]);

  // the player's current guesses, one per dropdown
  const [selectedNumbers, setSelectedNumbers] = useState([]);

  // the message shown after pressing Confirm
  const [result, setResult] = useState(null);

  // true/false for each box - was that box's guess correct?
  const [matchStatus, setMatchStatus] = useState([]);

  // when the current round started, and how long it took once solved
  const [startTime, setStartTime] = useState(null);
  const [completionTime, setCompletionTime] = useState(null);

  // makes an array of a given length, all filled with the same value
  function makeEmptyArray(length, fillValue) {
    const result = [];
    for (let i = 0; i < length; i++) {
      result.push(fillValue);
    }
    return result;
  }

  // makes a copy of an array so we don't change the original by accident
  function copyArray(arr) {
    const copy = [];
    for (let i = 0; i < arr.length; i++) {
      copy.push(arr[i]);
    }
    return copy;
  }

  // runs when the player presses "Start Game" on the front page
  function handleStart() {
    const newNumbers = makeNumbers(count);
    setNumbers(newNumbers);
    setSecretOrder(shuffleNumbers(newNumbers));
    setSelectedNumbers(makeEmptyArray(count, ""));
    setResult(null);
    setMatchStatus([]);
    setCompletionTime(null);
    setStartTime(Date.now());
    setScreen("play");
  }

  // runs when the player changes one dropdown
  function handleChange(index, value) {
    const updated = copyArray(selectedNumbers);
    updated[index] = value;
    setSelectedNumbers(updated);
    setResult(null);
    setMatchStatus([]);
  }

  // checks if every dropdown has a value picked
  function allBoxesFilled(guesses) {
    for (let i = 0; i < guesses.length; i++) {
      if (guesses[i] === "") {
        return false;
      }
    }
    return true;
  }

  // counts how many guesses match the secret order
  function checkGuesses(guesses, secret) {
    const statusPerBox = [];
    let matchCount = 0;

    for (let i = 0; i < secret.length; i++) {
      const guess = Number(guesses[i]);
      const isCorrect = guess === secret[i];
      statusPerBox.push(isCorrect);
      if (isCorrect) {
        matchCount++;
      }
    }

    return { statusPerBox, matchCount };
  }

  // runs when the player presses Confirm
  function handleConfirm() {
    if (!allBoxesFilled(selectedNumbers)) {
      setResult("Pick a number in every box first.");
      return;
    }

    const { statusPerBox, matchCount } = checkGuesses(selectedNumbers, secretOrder);
    const notMatchedCount = secretOrder.length - matchCount;

    setMatchStatus(statusPerBox);

    if (matchCount === secretOrder.length) {
      const elapsed = Date.now() - startTime;
      setCompletionTime(formatTime(elapsed));
      setResult("Got it!");
    } else {
      setResult(`${matchCount} matched, ${notMatchedCount} did not match`);
    }
  }

  // shuffles a fresh secret order and starts the clock over
  function handleReset() {
    setSecretOrder(shuffleNumbers(numbers));
    setSelectedNumbers(makeEmptyArray(count, ""));
    setResult(null);
    setMatchStatus([]);
    setCompletionTime(null);
    setStartTime(Date.now());
  }

  // goes back to this game's own start page (to change the count)
  function handleBackToStart() {
    setScreen("start");
    setResult(null);
    setCompletionTime(null);
  }

  if (screen === "start") {
    return (
      <div className="start-screen">
        <h1 className="game-title">Number Match</h1>
        <hr />
        <div className="start-options">
          <label htmlFor="count-input">
            How many numbers do you want to play with?
          </label>
          <input
            id="count-input"
            type="number"
            min="1"
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
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
        <div className="dropdown-row">
          {selectedNumbers.map((selected, index) => (
            <div key={index} className="dropdown-box">
              <select
                value={selected}
                onChange={(event) => handleChange(index, event.target.value)}
              >
                <option value="">Select</option>
                {numbers.map((number) => (
                  <option key={number} value={number}>
                    {number}
                  </option>
                ))}
              </select>

              {matchStatus[index] && <p className="got-it">Got it!</p>}
            </div>
          ))}
        </div>

        <div className="button-row">
          <button className="btn-primary" onClick={handleConfirm}>
            Confirm
          </button>
          <button className="btn-secondary" onClick={handleReset}>
            Reset
          </button>
          <button className="btn-secondary" onClick={handleBackToStart}>
            Back
          </button>
          <button className="btn-secondary" onClick={onBack}>
            Menu
          </button>
        </div>

        {result && <p className="result">{result}</p>}
        {completionTime && <p className="result">Time: {completionTime}</p>}
      </div>
    </div>
  );
}

export default NumberMatch;