"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Players({ setShowPlayers }) {
    const [rolesData, setRolesData] = useState([]);
    const [nightNumber, setNightNumber] = useState(1);
    const [selectedRoleIndex, setSelectedRoleIndex] = useState(null); // Index du rôle sélectionné
    const [modalVisible, setModalVisible] = useState(false); // Visibilité de la modal
    const [modalEndVisible, setModalEndVisible] = useState(false); // Visibilité de la modal
    const [gameEndMessage, setGameEndMessage] = useState(""); // Message de fin de jeu
    const router = useRouter();

    useEffect(() => {
        // Récupérer les données depuis le localStorage
        const storedRoles = localStorage.getItem("roles");
        if (storedRoles) {
            setRolesData(JSON.parse(storedRoles));
        }

        const savedData = JSON.parse(localStorage.getItem("gameData")) || {};
        setNightNumber(savedData.nightNumber || gameData.nightNumber || 1);
    }, []);

    const checkGameEndConditions = () => {
        const hackers = rolesData.filter(role => role.role === "Hacker");
        const nonHackers = rolesData.filter(role => role.role !== "Hacker");

        const allNonHackersDisabled = nonHackers.every(role => role.hacked || role.eliminated);
        const allHackersEliminated = hackers.every(role => role.eliminated);

        if (allNonHackersDisabled && hackers.some(hacker => !hacker.eliminated)) {
            setGameEndMessage("HACKERS WIN !");
            setModalEndVisible(true);
            return true;
        }

        if (allHackersEliminated) {
            setGameEndMessage("HACKERS LOST !");
            setModalEndVisible(true);
            return true;
        }

        return false;
    }; 

    const handleRoleClick = (index) => {
        setSelectedRoleIndex(index); // Sélectionner le rôle sur lequel on a cliqué
        setModalVisible(true); // Ouvrir la modal
    };
    const getAtoutImages = () => [
        { name: "vpn", src: "/img/atouts/vpn.png" },
        { name: "password", src: "/img/atouts/password.png" },
        { name: "virus", src: "/img/atouts/virus.png" }
    ];

    const handleDeleteAtout = (name) => {
        if (rolesData[selectedRoleIndex]?.hacked) return; // Bloquer si hacké

        const updatedRolesData = [...rolesData];
        const selectedRole = updatedRolesData[selectedRoleIndex];

        // Supprimer le premier atout correspondant (si doublons, supprimer uniquement un élément à la fois)
        const atoutIndex = selectedRole.atouts.indexOf(name);
        if (atoutIndex !== -1) {
            selectedRole.atouts.splice(atoutIndex, 1); // Supprimer l'atout trouvé
        }

        // Mettre à jour les données dans le localStorage
        setRolesData(updatedRolesData);
        localStorage.setItem("roles", JSON.stringify(updatedRolesData));
    };

    const handleAddAtout = (atout) => {
        if (rolesData[selectedRoleIndex]?.hacked) return; // Bloquer si hacké

        const updatedRolesData = [...rolesData];
        const selectedRole = updatedRolesData[selectedRoleIndex];

        // Ajouter l'atout si l'emplacement est vide
        if (selectedRole.atouts[0] === "") {
            selectedRole.atouts[0] = atout;
        } else if (selectedRole.atouts[1] === "") {
            selectedRole.atouts[1] = atout;
        } else {
            selectedRole.atouts.push(atout); // Ajouter un atout si les deux premiers emplacements sont remplis
        }

        // Mettre à jour les données dans le localStorage
        setRolesData(updatedRolesData);
        localStorage.setItem("roles", JSON.stringify(updatedRolesData));
    };


    const toggleRoleEliminated = () => {
        if (selectedRoleIndex !== null) {
            const updatedRolesData = [...rolesData];
            const selectedRole = updatedRolesData[selectedRoleIndex];
    
            selectedRole.eliminated = !selectedRole.eliminated;
    
            // Met à jour les données
            setRolesData(updatedRolesData);
            localStorage.setItem("roles", JSON.stringify(updatedRolesData));
    
            // Vérifie les conditions de fin de jeu
            checkGameEndConditions();
        }
    };

    const toggleRoleHacked = () => {
        if (selectedRoleIndex !== null) {
            const updatedRolesData = [...rolesData];
            const selectedRole = updatedRolesData[selectedRoleIndex];
    
            selectedRole.hacked = !selectedRole.hacked;
    
            // Met à jour les données
            setRolesData(updatedRolesData);
            localStorage.setItem("roles", JSON.stringify(updatedRolesData));
    
            // Vérifie les conditions de fin de jeu
            checkGameEndConditions();
        }
    };



    return (
        <main className="w-100 bg-[url('/img/moon.png')] bg-cover bg-center bg-fixed flex flex-col items-center pt-6 transition-all duration-300">
            <ul className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10 mb-40">
                {rolesData.map((role, index) => (
                    <li
                        key={index}
                        className={`flex flex-col items-center p-4 bg-black/[0.4] rounded-lg shadow-md cursor-pointer ${role.eliminated && "bg-red-800/[0.5]"}`}
                        onClick={() => handleRoleClick(index)}
                    >
                        <img
                            src={role.img}
                            alt={role.role}
                            className="w-28 h-28 mb-2 rounded-md"
                        />
                        <p className="text-lg text-white font-semibold">{role.role}</p>
                        <p className="text-sm text-white">{role.player ? role.player : "Non assigné"}</p>
                        <div className="flex gap-2 mt-2">
                            {/* Afficher les atouts existants */}
                            {role.atouts.map((atout, index) => (
                                <div
                                    key={index}
                                    className={`w-12 h-20 flex items-center justify-center rounded-md border ${rolesData[selectedRoleIndex]?.hacked
                                        ? "bg-gray-600 border-gray-500 opacity-50"
                                        : "bg-gray-800 border-gray-600"
                                        }`}
                                >
                                    {atout !== "" && (
                                        <img
                                            src={`/img/atouts/${atout}.png`}
                                            alt={atout}
                                            className={`h-full w-full rounded-md ${rolesData[selectedRoleIndex]?.hacked && "opacity-50"
                                                }`}
                                        />
                                    )}
                                </div>

                            ))}

                            {/* Si il y a moins de 2 atouts, ajouter des rectangles vides */}
                            {role.atouts.length < 2 && (
                                <>
                                    {/* Premier rectangle vide si nécessaire */}
                                    {role.atouts.length === 0 && (
                                        <div className="flex gap-2">
                                            <div className="w-12 h-20 bg-gray-800 flex items-center justify-center rounded-md border border-gray-600"></div>
                                            <div className="w-12 h-20 bg-gray-800 flex items-center justify-center rounded-md border border-gray-600"></div>
                                        </div>

                                    )}
                                    {/* Deuxième rectangle vide si nécessaire */}
                                    {role.atouts.length === 1 && (
                                        <div className="w-12 h-20 bg-gray-800 flex items-center justify-center rounded-md border border-gray-600"></div>
                                    )}
                                </>
                            )}
                        </div>


                    </li>
                ))}
            </ul>

            <div
                className="fixed top-full -translate-y-full bg-gradient-to-b from-zinc-950 to-purple-950 w-full h-36 cursor-pointer z-50 flex items-center justify-center gap-1"
                onClick={() => setShowPlayers(false)}
            >
                <span className="text-white text-5xl">NIGHT {nightNumber}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="white" className="bi bi-arrow-down-short" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4" />
                </svg>
            </div>


            {modalVisible && selectedRoleIndex !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-50">
                    <div className="bg-black/[0.7] p-6 rounded-lg shadow-lg text-white text-center w-96">
                        <h2 className="text-xl mb-4">Ajouter un Atout à {rolesData[selectedRoleIndex].role}</h2>

                        <div className="flex flex-col items-center mb-4">
                            <img
                                src={rolesData[selectedRoleIndex].img}
                                alt={rolesData[selectedRoleIndex].role}
                                className="w-28 h-28 mb-2 rounded-md"
                            />
                            <p className="text-lg font-semibold">{rolesData[selectedRoleIndex].role}</p>
                            <p className="text-sm">
                                {rolesData[selectedRoleIndex].player ? rolesData[selectedRoleIndex].player : "Non assigné"}
                            </p>
                            <div className="flex gap-2 mt-2">
                                {/* Affichage des atouts */}
                                {rolesData[selectedRoleIndex].atouts.map((atout, index) => (
                                    <div
                                        key={index}
                                        className={`w-12 h-20 flex items-center justify-center rounded-md border ${rolesData[selectedRoleIndex]?.hacked
                                            ? "bg-gray-600 border-gray-500 opacity-50 cursor-not-allowed"
                                            : "bg-gray-800 border-gray-600"
                                            }`}
                                        onClick={() => !rolesData[selectedRoleIndex]?.hacked && handleDeleteAtout(atout)} // Bloquer si hacké
                                    >
                                        {atout !== "" && (
                                            <img
                                                src={`/img/atouts/${atout}.png`}
                                                alt={atout}
                                                className={`h-full w-full rounded-md ${rolesData[selectedRoleIndex]?.hacked && "opacity-50"
                                                    }`}
                                            />
                                        )}
                                    </div>
                                ))}


                                {/* Afficher les rectangles vides si nécessaire pour compléter les 2 rectangles */}
                                {rolesData[selectedRoleIndex].atouts.length < 2 && (
                                    <>
                                        {rolesData[selectedRoleIndex].atouts.length === 0 && (
                                            <div className="flex gap-2">
                                                <div className="w-12 h-20 bg-gray-800 flex items-center justify-center rounded-md border border-gray-600"></div>
                                                <div className="w-12 h-20 bg-gray-800 flex items-center justify-center rounded-md border border-gray-600"></div>
                                            </div>
                                        )}

                                        {rolesData[selectedRoleIndex].atouts.length === 1 && (
                                            <div className="w-12 h-20 bg-gray-800 flex items-center justify-center rounded-md border border-gray-600"></div>
                                        )}
                                    </>
                                )}
                            </div>



                        </div>

                        <div className="flex gap-4 mb-4 items-center justify-center">
                            {getAtoutImages().map(({ name, src }) => (
                                <div
                                    key={name}
                                    onClick={() => !rolesData[selectedRoleIndex]?.hacked && handleAddAtout(name)} // Bloquer si hacké
                                    className={`cursor-pointer w-12 h-20 bg-gray-800 rounded-md border border-gray-600 ${rolesData[selectedRoleIndex]?.hacked
                                        ? "opacity-50 cursor-not-allowed"
                                        : rolesData[selectedRoleIndex].atouts.includes(name) && "border-green-500"
                                        }`}
                                >
                                    <img src={src} alt={name} className="h-full w-full rounded-md" />
                                </div>

                            ))}
                        </div>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={toggleRoleHacked}
                                className={`px-4 py-2 rounded text-white ${rolesData[selectedRoleIndex]?.hacked ? "bg-violet-500 hover:bg-violet-800" : "bg-violet-800 hover:bg-violet-800"
                                    }`}
                            >
                                {rolesData[selectedRoleIndex]?.hacked ? "Unhack" : "Hack"}
                            </button>
                            <button
                                onClick={toggleRoleEliminated}
                                className={`px-4 py-2 rounded text-white ${rolesData[selectedRoleIndex]?.eliminated ? "bg-red-500 hover:bg-red-600" : "bg-red-500 hover:bg-red-600"
                                    }`}
                            >
                                {rolesData[selectedRoleIndex]?.eliminated ? "Revive" : "Eliminate"}
                            </button>

                            <button
                                onClick={() => setModalVisible(false)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                                Close
                            </button>
                        </div>
                    </div>


                </div>
            )}
            {gameEndMessage && modalEndVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-50">
                    <div className="flex flex-col items-center justify-center gap-5 bg-purple-950 p-6 rounded-lg shadow-lg text-white text-center w-96 h-1/4">
                        <h2 className="text-4xl mb-4">{gameEndMessage}</h2>
                        <button
                            onClick={() => router.push(`/`)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                            Restart Game
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}    