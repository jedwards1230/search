export default function References({
    intermediateSteps,
}: {
    intermediateSteps: Observation[];
}) {
    return (
        <>
            <h2 className="pb-2 text-lg font-medium">References</h2>
            <div className="">
                {intermediateSteps.map((step, i) => (
                    <div
                        key={step.link + i}
                        className="flex flex-col gap-1 pb-2"
                    >
                        <div className="rounded p-2 hover:bg-neutral-200/75 dark:hover:bg-neutral-600/50">
                            <a href={step.link} target="_blank">
                                <div className="pb-1">{step.title}</div>
                                <div className="text-sm">{step.snippet}</div>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
