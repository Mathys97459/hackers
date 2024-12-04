"use client";

import { useEffect, useState } from "react";
import gameData from "../lib/game.json";

export default function Night() {
    const [nightNumber, setNightNumber] = useState(1);
    const [event, setEvent] = useState("No event");
    const [bonus, setBonus] = useState("No bonus");
    const [eventsLeft, setEventsLeft] = useState({});
    const [bonusLeft, setBonusLeft] = useState({});
    const [eventDrawn, setEventDrawn] = useState(false);
    const [bonusDrawn, setBonusDrawn] = useState(false);
    const [showModal, setShowModal] = useState(false); // Nouveau state pour afficher la modal
    const [modalContent, setModalContent] = useState(""); // Contenu de la modal

    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem("gameData")) || {};
        setNightNumber(savedData.nightNumber || gameData.nightNumber || 1);
        setEvent(savedData.event || "No event");
        setBonus(savedData.bonus || "No bonus");
        setEventsLeft(savedData.eventsLeft || gameData.events || {});
        setBonusLeft(savedData.bonusLeft || {
            noBonus: 2,
            vpn: 2,
            password: 2,
            virus: 2,
        });
        setEventDrawn(savedData.eventDrawn || false);
        setBonusDrawn(savedData.bonusDrawn || false);
    }, []);

    const saveGameData = (updatedData) => {
        const currentData = JSON.parse(localStorage.getItem("gameData")) || {};
        const newData = { ...currentData, ...updatedData };
        localStorage.setItem("gameData", JSON.stringify(newData));
    };

    const saveRoleBonus = (role, bonus) => {
        const roles = JSON.parse(localStorage.getItem("roles")) || [];
        
        // Trouver l'index du rôle
        const roleIndex = roles.findIndex(r => r.player === role.player); // Assume 'name' est un identifiant unique du rôle
        console.log(roleIndex)
        if (roleIndex !== -1) {
            // Ajouter le bonus à l'attribut 'atouts' du rôle
            {bonus != "No bonus" && (
                roles[roleIndex].atouts.push(bonus)
            )}
            
            // Sauvegarder les rôles mis à jour dans localStorage
            localStorage.setItem("roles", JSON.stringify(roles));
        } else {
            console.error("Role not found!");
        }
    };
    

    // Fonction pour tirer un joueur au hasard
    const getRandomPlayer = () => {
        const players = JSON.parse(localStorage.getItem("roles")) || [];
        if (players.length === 0) {
            return null; // Aucun joueur disponible
        }
        const randomIndex = Math.floor(Math.random() * players.length);
        return players[randomIndex];
    };

    const handleRandomEvent = () => {
        if (eventDrawn) {
            alert("Event already drawn for this night.");
            return;
        }

        const availableEvents = Object.entries(eventsLeft).filter(([_, count]) => count > 0);

        if (availableEvents.length === 0) {
            setEvent("No Events Left");
            return;
        }

        const randomIndex = Math.floor(Math.random() * availableEvents.length);
        const [selectedEvent] = availableEvents[randomIndex];

        const updatedEvents = { ...eventsLeft, [selectedEvent]: eventsLeft[selectedEvent] - 1 };

        setEvent(selectedEvent);
        setEventsLeft(updatedEvents);
        setEventDrawn(true);
        saveGameData({ event: selectedEvent, eventsLeft: updatedEvents, eventDrawn: true });

        // Affichage de la modal pour l'événement
        setModalContent(`EVENT : ${selectedEvent != "noEvent" ? selectedEvent.toUpperCase() : "NO EVENT"}`);
        setShowModal(true);
    };

    const handleRandomBonus = () => {
        if (bonusDrawn) {
            return;
        }

        const availableBonuses = Object.entries(bonusLeft).filter(([_, count]) => count > 0);

        if (availableBonuses.length === 0) {
            setBonus("No Bonuses Left");
            return;
        }

        const randomIndex = Math.floor(Math.random() * availableBonuses.length);
        const [selectedBonus] = availableBonuses[randomIndex];

        const updatedBonuses = { ...bonusLeft, [selectedBonus]: bonusLeft[selectedBonus] - 1 };

        setBonus(selectedBonus);
        setBonusLeft(updatedBonuses);
        setBonusDrawn(true);
        saveGameData({ bonus: selectedBonus, bonusLeft: updatedBonuses, bonusDrawn: true });

        // Tirage aléatoire d'un joueur pour attribuer le bonus
        const randomPlayer = getRandomPlayer();
        console.log(selectedBonus)
        if (randomPlayer && selectedBonus != "noBonus") {
            // Assigner le bonus au joueur
            saveRoleBonus(randomPlayer, selectedBonus); // Assumer que chaque joueur a un attribut 'name'
            setModalContent(`BONUS: ${selectedBonus.toUpperCase()} ASSIGNED TO ${randomPlayer.player.toUpperCase()}`);
        } else {
            setModalContent("No bonus for this night.");
        }

        // Affichage de la modal pour le bonus
        setShowModal(true);
    };

    const previousNight = () => {
        const newNight = Math.max(nightNumber - 1, 1);
        setNightNumber(newNight);
        setEventDrawn(false);
        setBonusDrawn(false);
        saveGameData({ nightNumber: newNight, eventDrawn: false, bonusDrawn: false });
    };

    const nextNight = () => {
        const newNight = nightNumber + 1;
        setNightNumber(newNight);
        setEventDrawn(false);
        setBonusDrawn(false);
        saveGameData({ nightNumber: newNight, eventDrawn: false, bonusDrawn: false });
    };

    return (
        <div id="night" className="h-1/2 flex flex-col items-center justify-center">
            <div className="flex gap-4">
                <button onClick={previousNight}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" className="bi bi-chevron-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                    </svg>
                </button>
                <h1 className="text-6xl text-white">NIGHT {nightNumber}</h1>
                <button onClick={nextNight}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" className="bi bi-chevron-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
                    </svg>
                </button>
            </div>
            <p className="text-white text-lg my-3">Event tonight : {event != "noEvent" ? event : "no event"}</p>
            <div className="flex gap-4 mt-5">
                <button onClick={handleRandomEvent} disabled={eventDrawn || Object.entries(eventsLeft).filter(([_, count]) => count > 0).length == 0} className="px-6 py-2 bg-violet-700 border text-white rounded hover:bg-violet-900 disabled:opacity-50">
                    Event
                </button>
                <button onClick={handleRandomBonus} disabled={bonusDrawn || Object.entries(bonusLeft).filter(([_, count]) => count > 0).length == 0} className="px-6 py-2 bg-white text-violet-1000 rounded hover:bg-gray-200 disabled:opacity-50">
                    Bonus
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 text-center rounded-lg shadow-lg w-2/3">
                        <h2 className="text-2xl text-center font-semibold">{modalContent}</h2>
                        <button onClick={() => setShowModal(false)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
