"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import rolesData from "../../lib/roles.json"; // Importation du fichier JSON contenant les rôles

export default function RoleDistribution() {
    const searchParams = useSearchParams();
    const numPlayers = Number(searchParams.get("players"));
    const [roles, setRoles] = useState([]);
    const [currentRoleIndex, setCurrentRoleIndex] = useState(0); // Index du rôle à afficher
    const [flipped, setFlipped] = useState(true); // Etat de la carte (initialement retournée)

    useEffect(() => {
        if (numPlayers) {
            // On commence par ajouter tous les rôles spéciaux au tableau
            const specialRoles = rolesData.map(role => role.role); // Extraire les noms des rôles spéciaux
            const remainingPlayers = numPlayers - specialRoles.length;

            // Compléter avec des Villageois si nécessaire
            const allRoles = [
                ...specialRoles,
                ...Array(remainingPlayers).fill("Villageois")
            ];

            // Mélange les rôles et garde seulement ceux correspondant au nombre de joueurs
            const shuffledRoles = allRoles.sort(() => Math.random() - 0.5);
            console.log(shuffledRoles.slice(0, numPlayers))
            setRoles(shuffledRoles.slice(0, numPlayers));
        }
    }, [numPlayers]);

    const handleCardClick = () => {
        if (flipped) {
            // Si la carte est déjà retournée, on passe au rôle suivant
            setCurrentRoleIndex(currentRoleIndex + 1);
        }
        setFlipped(!flipped); // Inverse l'état de la carte
    };

    // Trouver l'image associée au rôle courant
    const getRoleImage = (role) => {
        const roleData = rolesData.find(r => r.role === role);
        return roleData ? roleData.img : "/img/player-card/default.png"; // Image par défaut si le rôle n'est pas trouvé
    };

    return (
        <main className="flex flex-col items-center mt-10 h-screen">
            {currentRoleIndex < roles.length ? (

                <div className="flex flex-col">
                        <>
                            {flipped ? (
                                <p className="text-lg text-center font-semibold m-4 h-20" >
                                    Tape to <br /> <span className="text-3xl">Reveal</span>
                                </p>

                            ) : (
                                <p className="text-lg text-center font-semibold m-4 h-20" style={{
                                    display: flipped ? 'none' : 'block',
                                }}>
                                    Your role is : <br /> <span className="text-3xl">{roles[currentRoleIndex]}</span>
                                </p>
                            )}
                        </>

                    <div
                        onClick={handleCardClick}
                        className="w-64 h-72 bg-blue-500 text-white flex items-center cursor-pointer rounded-lg mb-4 shadow-md hover:bg-blue-600 transition-transform duration-500"
                        style={{
                            perspective: '1000px',
                        }}
                    >
                        <div className="w-full aspect-square m-5 rounded-lg" style={{ backgroundColor: '#132226' }}>
                            <div
                                className="w-full h-full relative transform-style-preserve-3d transition-transform duration-500"
                                style={{
                                    transform: flipped ? 'rotateY(180deg)' : '',
                                }}
                            >
                                {/* Côté recto (dos de la carte) */}
                                <div className="w-full h-full absolute rounded-lg backface-hidden items-center justify-center transform rotateY-180">
                                    <img src={getRoleImage(roles[currentRoleIndex])} alt={roles[currentRoleIndex]} style={{
                                        display: flipped ? 'none' : 'block',
                                    }} />
                                    <img src="/img/dos-carte.png" alt={roles[currentRoleIndex]} style={{
                                        display: flipped ? 'block' : 'none',
                                    }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-lg font-semibold text-green-600 mt-6">Tous les rôles ont été distribués !</p>
            )}
        </main>
    );
}
