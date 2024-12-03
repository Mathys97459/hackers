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
    <main className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Mini-Jeu : Sélection du nombre de joueurs</h1>
      <div className="flex flex-col items-center">
        <label htmlFor="players" className="text-lg mb-2">
          Nombre de joueurs : {players}
        </label>
        <input
          id="players"
          type="range"
          min="8"
          max="16"
          value={players}
          onChange={(e) => setPlayers(Number(e.target.value))}
          className="w-64"
        />
        <button
          onClick={handleStartGame}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Distribuer les rôles
        </button>
      </div>
    </main>
  );
}
