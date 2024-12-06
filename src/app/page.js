"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [players, setPlayers] = useState(8);
  const router = useRouter();

  // Vérifier et initialiser achievements
  useEffect(() => {
    const achievements = localStorage.getItem("achievements");
    if (!achievements) {
      const initialAchievements = {
        gamesPlayed: 0,
        gamesWinHackers: 0,
        gamesWinNonHackers: 0,
      };
      localStorage.setItem("achievements", JSON.stringify(initialAchievements));
    }
  }, []);

  const handleStartGame = () => {
    // Initialisation des données de jeu
    const initialGameData = {
      players,
      nightNumber: 1,
      event: "No Event",
      bonus: "No Bonus",
      eventsLeft: {
        noEvent: 4,
        blackout: 2,
        update: 2,
      },
      bonusLeft: {
        noBonus: 2,
        vpn: 2,
        password: 2,
        virus: 2,
      },
      eventDrawn: false,
      bonusDrawn: false,
    };

    localStorage.setItem("gameData", JSON.stringify(initialGameData));

    // Redirection
    router.push(`game/roles?players=${players}`);
  };

  return (
    <main className="bg-[url('/img/background.png')] flex flex-col items-center text-white gap-10 justify-start pt-28 h-svh">
      <h1 className="text-5xl font-bold mb-0">Hackers</h1>
      <img className="w-6/12" src="/img/dos-carte.png" />
      <div className="flex flex-col items-center">
        <label htmlFor="players" className="text-sm mb-2">
          Number of players : {players}
        </label>
        <input
          id="players"
          type="range"
          min="8"
          max="16"
          value={players}
          onChange={(e) => setPlayers(Number(e.target.value))}
          className="w-64 color-black"
        />
        <button
          onClick={handleStartGame}
          className="mt-8 px-6 py-2 bg-white text-purple-900 border border-slate-400 rounded hover:bg-purple-900 hover:text-white"
        >
          PLAY GAME
        </button>
        <button
          onClick={() => {
            router.push(`achievements`);
          }}
          className="mt-5 px-6 py-2 bg-purple-900 text-white border border-slate-400 rounded hover:bg-purple-700"
        >
          ACHIEVEMENTS
        </button>
      </div>
    </main>
  );
}
