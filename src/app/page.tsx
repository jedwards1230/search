import Results from "./results";

export const runtime = "edge";

export default async function Page() {
	return (
		<main className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
			<div className="text-4xl font-medium underline transition-colors decoration-black/50 hover:decoration-black dark:decoration-white/50 dark:hover:decoration-white">
				Search
			</div>
			<Results />
		</main>
	);
}
