"use client";

import { Suspense } from "react";
import RoleDistributionContent from "../../composants/RoleDistributionContent";

export default function RoleDistribution() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <RoleDistributionContent />
        </Suspense>
    );
}
