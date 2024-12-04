"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import rolesJson from "../../lib/roles.json"; // Importation du fichier JSON contenant les rôles

export default function RoleDistribution() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const numPlayers = Number(searchParams.get("players"));
    const [roles, setRoles] = useState([]);
    const [rolesData, setRolesData] = useState([]);
    const [currentRoleIndex, setCurrentRoleIndex] = useState(-1);
    const [flipped, setFlipped] = useState(true);
    const [playerName, setPlayerName] = useState("");
    const [modal, setModal] = useState({ visible: false, message: "", type: "" });

    useEffect(() => {
        if (numPlayers) {
            const specialRoles = rolesJson.filter(role => role.role !== "Employee" && role.role !== "Hacker").map(role => ({ ...role }));
            const hackersCount = Math.round(numPlayers / 3);
            const remainingPlayers = numPlayers - hackersCount;

            // Rôles initiaux avec hackers
            const initialRoles = [
                ...Array(hackersCount).fill({
                    role: "Hacker",
                    img: "/img/player-card/hacker.png",
                    player: "",
                    atouts: [],
                    hacked : false,
                    eliminated : false
                }),
            ];

            // Ajout de rôles aléatoires parmi les rôles spéciaux (hors employee)
            const shuffledSpecialRoles = specialRoles.sort(() => Math.random() - 0.5);
            let remainingSpecialRoles = shuffledSpecialRoles.slice(0, remainingPlayers);

            // Compléter avec des employees si nécessaire
            const employeesCount = remainingPlayers - remainingSpecialRoles.length;
            const employees = Array(employeesCount).fill({
                role: "Employee",
                img: "/img/player-card/employee.png",
                player: "",
                atouts: [],
                hacked : false,
                eliminated : false
            });

            const allRoles = [
                ...initialRoles,
                ...remainingSpecialRoles,
                ...employees,
            ];

            const shuffledRoles = allRoles.sort(() => Math.random() - 0.5);

            setRoles(shuffledRoles.map(role => role.role));
            setRolesData(shuffledRoles);

            if (!localStorage.getItem("roles")) {
                localStorage.setItem("roles", JSON.stringify(shuffledRoles));
            }
        }
    }, [numPlayers]);

    const handleCardClick = () => {
        if (!flipped && !playerName.trim()) {
            setModal({
                visible: true,
                message: "You have to enter a name.",
                type: "error",
            });
            return;
        }

        if (flipped) {
            setPlayerName("");
        }
        setCurrentRoleIndex(currentRoleIndex + 1);
        setFlipped(!flipped);
    };

    const handleNameChange = (e) => {
        setPlayerName(e.target.value);
    };

    const handleSubmit = () => {
        if (playerName.trim()) {
            const updatedRolesData = [...rolesData];
            updatedRolesData[currentRoleIndex] = {
                ...updatedRolesData[currentRoleIndex],
                player: playerName,
            };
            setRolesData(updatedRolesData);
            setFlipped(true);
            localStorage.setItem("roles", JSON.stringify(updatedRolesData));

            // Vérifier si tous les rôles ont été assignés
            if (updatedRolesData.every(role => role.player.trim() !== "")) {
                // Redirection vers la page /game
                router.push("/game");
            }
        } else {
            setModal({
                visible: true,
                message: "Please enter a valid name.",
                type: "error",
            });
        }
    };

    const closeModal = () => {
        setModal({ visible: false, message: "", type: "" });
    };

    const getRoleImage = (role) => {
        const roleData = rolesData.find(r => r.role === role);
        return roleData ? roleData.img : "/img/player-card/employee.png";
    };

    return (
        <main className="flex flex-col items-center mt-10 h-screen">
            {modal.visible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg text-center">
                        <p className={`text-lg ${modal.type === "success" ? "text-green-500" : "text-red-500"}`}>
                            {modal.message}
                        </p>
                        <button
                            onClick={closeModal}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}

            {currentRoleIndex < roles.length && (
                <div className="flex flex-col items-center pt-20">
                    <>
                        {flipped ? (
                            <p className="text-lg text-white text-center font-semibold h-20">
                                Tape to <br /> <span className="text-3xl">Reveal</span>
                            </p>
                        ) : (
                            <p className="text-lg text-white text-center font-semibold h-20">
                                Your role is : <br /> <span className="text-3xl">{roles[currentRoleIndex]}</span>
                            </p>
                        )}
                    </>
                    <div
                        onClick={handleCardClick}
                        className="w-64 h-72 text-white flex items-center cursor-pointer rounded-lg mb-4 shadow-md transition-transform duration-500"
                        style={{ perspective: "1000px", backgroundColor: "rgba(19, 34, 38, 0.5)" }}
                    >
                        <div className="w-full aspect-square m-5 rounded-lg" style={{ backgroundColor: "#132226" }}>
                            <div
                                className="w-full h-full relative transform-style-preserve-3d transition-transform duration-500"
                                style={{
                                    transform: flipped ? "rotateY(180deg)" : "",
                                }}
                            >
                                <div className="w-full h-full absolute rounded-lg backface-hidden items-center justify-center transform rotateY-180">
                                    <img
                                        src={getRoleImage(roles[currentRoleIndex])}
                                        alt={roles[currentRoleIndex]}
                                        style={{ display: flipped ? "none" : "block" }}
                                    />
                                    <img
                                        src="/img/dos-carte.png"
                                        alt={roles[currentRoleIndex]}
                                        style={{ display: flipped ? "block" : "none" }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {!flipped && (
                        <div className="flex flex-col items-center mt-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={playerName}
                                    onChange={handleNameChange}
                                    placeholder="Register your name"
                                    className="p-2 border rounded"
                                />
                                <button
                                    onClick={handleSubmit}
                                    className="bg-violet-900 border border-slate-400 text-white p-2 rounded"
                                >
                                    Valider
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}
