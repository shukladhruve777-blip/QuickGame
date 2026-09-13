import { useState } from "react";
import "./App.css";
import NumberMatch from "./NumberMatch";
import HigherLower from "./HigherLower";

const GAMES = [
  { id: "numberMatch", name: "Number Match" },
  { id: "higherLower", name: "Higher or Lower" },
];

function App() {
  // which game is showing, or "menu" for the game picker
  const [screen, setScreen] = useState("menu");

  function goToMenu() {
    setScreen("menu");
  }

  if (screen === "menu") {
    return (
      <div className="start-screen">
        <h1 className="game-title">Mini Games</h1>
        <hr />
        <div className="start-options">
          {GAMES.map((game) => (
            <button
              key={game.id}
              className="btn-primary"
              onClick={() => setScreen(game.id)}
            >
              {game.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (screen === "numberMatch") {
    return <NumberMatch onBack={goToMenu} />;
  }

  if (screen === "higherLower") {
    return <HigherLower onBack={goToMenu} />;
  }

  return null;
}

export default App;