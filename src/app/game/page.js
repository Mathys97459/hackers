"use client";

import { useState } from "react";
import Players from "../composants/Players";
import Night from "../composants/Night";
import gameData from "../lib/game.json";

export default function Game() {
    const [showPlayers, setShowPlayers] = useState(false);

    const handlePlayersClick = () => {
        setShowPlayers(true);
    };

    return (
        <>
            <div className={`${!showPlayers ? "h-screen" : "h-0"} relative overflow-hidden transition-all duration-300`}>
                {!showPlayers && (
                    <div
                        className={`w-100 bg-[url('/img/moon.png')] bg-cover bg-center w-100 h-1/2 flex flex-col justify-end items-center pb-8 cursor-pointer transition-all duration-300`}
                        onClick={handlePlayersClick}
                    >
                        <h1 className="text-white text-center text-6xl">PLAYERS</h1>
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="white" className="bi bi-arrow-up-short" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5" />
                        </svg>
                    </div>
                )}
                <div className={`transition-all duration-300 ${showPlayers ? "h-0 opacity-0 pointer-events-none" : "h-full"}`}>
                    <Night />
                </div>
            </div>
            {showPlayers && (
                <Players />

            )}
        </>
    );
}
