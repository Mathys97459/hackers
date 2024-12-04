"use client";

import { useEffect, useState } from "react";

export default function Game() {
    const [rolesData, setRolesData] = useState([]);

    useEffect(() => {
        // Récupérer les données depuis le localStorage
        const storedRoles = localStorage.getItem("roles");
        if (storedRoles) {
            setRolesData(JSON.parse(storedRoles));
        }
    }, []);

    return (
        <main className="flex flex-col items-center mt-6">
            <ul className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rolesData.map((role, index) => (
                    <li
                        key={index}
                        className="flex flex-col items-center p-4 border rounded-lg shadow-md"
                    >
                        <img
                            src={role.img}
                            alt={role.role}
                            className="w-20 h-20 mb-2 rounded-full"
                        />
                        <p className="text-lg text-white font-semibold">{role.role}</p>
                        <p className="text-sm text-white">
                            {role.player ? role.player : "Non assigné"}
                        </p>
                    </li>
                ))}
            </ul>
        </main>
    );
}
