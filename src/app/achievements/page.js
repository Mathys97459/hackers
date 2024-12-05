"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Achievements() {
    const [achievements, setAchievements] = useState({
        gamesPlayed: 0,
        gamesWinHackers: 0,
        gamesWinNonHackers: 0,
    });
    const router = useRouter();

    // Récupérer les achievements depuis le localStorage
    useEffect(() => {
        const storedAchievements = localStorage.getItem("achievements");
        if (storedAchievements) {
            setAchievements(JSON.parse(storedAchievements));
        }
    }, []);

    const challenges = [
        {
            title: "Play 5 Games",
            current: achievements.gamesPlayed,
            goal: 5,
        },
        {
            title: "Play 10 Games",
            current: achievements.gamesPlayed,
            goal: 10,
        },
        {
            title: "Play 20 Games",
            current: achievements.gamesPlayed,
            goal: 20,
        },
        {
            title: "Win 10 Games as Hackers",
            current: achievements.gamesWinHackers,
            goal: 10,
        },
        {
            title: "Win 10 Games as Non-Hackers",
            current: achievements.gamesWinNonHackers,
            goal: 10,
        },
    ];

    const ProgressBar = ({ current, goal }) => {
        const percentage = Math.min((current / goal) * 100, 100);
        return (
            <div className="w-full bg-gray-300 rounded-full h-4">
                <div
                    className="bg-blue-600 h-4 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        );
    };

    const CheckIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" className="bi bi-check-circle" viewBox="0 0 16 16">
            <path d="M2.866 4.866a.5.5 0 0 1 .708 0L7 7.793l3.146-3.146a.5.5 0 1 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708z" />
            <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1z" />
        </svg>
    );

    const isGoalReached = (current, goal) => current >= goal;

    return (
        <main className="w-100 bg-[url('/img/moon.png')] bg-cover h-svh bg-center bg-fixed text-white">
            <button onClick={() => {
                router.push(`/`);
            }}
                className="mt-5 px-6 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" className="bi bi-house-door-fill" viewBox="0 0 16 16">
                    <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
                </svg>
            </button>
            <div className="flex flex-col items-center justify-center gap-10 mt-40">
                <h1 className="text-4xl">ACHIEVEMENTS</h1>
                <div className="w-3/4 flex flex-col gap-5">
                    {challenges.map((challenge, index) => (
                        <div key={index} className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <span>{challenge.title}</span>
                                <div className="flex items-center">
                                    <span className="mr-2">
                                        {challenge.current > challenge.goal ? challenge.goal : challenge.current} / {challenge.goal}
                                    </span>
                                    {isGoalReached(challenge.current, challenge.goal) && <CheckIcon />}
                                </div>
                            </div>
                            <ProgressBar current={challenge.current} goal={challenge.goal} />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
