"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const RoleDistributionContent = dynamic(() => import("../../composants/RoleDistributionContent"), {
    ssr: false
});
export default function RoleDistribution() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <RoleDistributionContent />
        </Suspense>
    );
}
