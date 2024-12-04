"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [players, setPlayers] = useState(8);
  const router = useRouter();

  const handleStartGame = () => {
    router.push(`game/roles?players=${players}`);
  };

  return (
    <main className="bg-[url('/img/background.png')] flex flex-col items-center text-white gap-10 justify-start pt-28 h-screen">
      <h1 className="text-4xl font-bold mb-6">Hackers</h1>
      <img className="w-6/12" src="/img/dos-carte.png"/>
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
          className="mt-5 px-6 py-2 bg-white text-violet-900 border border-slate-400 rounded hover:bg-blue-600"
        >
          PLAY GAME
        </button>
      </div>
    </main>
  );
}
