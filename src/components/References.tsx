"use client";

import { useState, useMemo } from "react";
import Pagination from "./Pagination";

export default function References({
	intermediateSteps,
}: {
	intermediateSteps: IntermediateStep[];
}) {
	const [currentPage, setCurrentPage] = useState(1);

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
	};

	const currentStep = useMemo(() => {
		return intermediateSteps[currentPage - 1];
	}, [intermediateSteps, currentPage]);

	if (currentStep.action.tool === "calculator") return null;
	return (
		<>
			<h2 className="text-lg font-medium">References</h2>
			{currentStep && currentStep.observation && (
				<div className="flex flex-col gap-2 pb-2">
					{currentStep.observation.map((obs, i) => (
						<div
							className="p-2 rounded hover:bg-neutral-200/75 dark:hover:bg-neutral-600/50"
							key={i}
						>
							<a href={obs.link} target="_blank">
								<div>{obs.title}</div>
								<div>{obs.snippet}</div>
							</a>
						</div>
					))}
				</div>
			)}
			<Pagination
				currentPage={currentPage}
				totalPages={intermediateSteps.length}
				onPageChange={handlePageChange}
			/>
		</>
	);
}
