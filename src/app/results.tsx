"use client";

import References from "@/components/References";
import SearchIcon from "@/components/SearchIcon";
import { FormEvent, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

const defaultStr = "5+5";
//"i am experienced with rest apis and mysql. how can i start learning about graphql?";

export default function Results() {
	const [loading, setLoading] = useState(false);
	const [query, setQuery] = useState(defaultStr);
	const [results, setResults] = useState("");
	const [intermediateSteps, setIntermediateSteps] = useState<
		IntermediateStep[]
	>([]);

	const getResults = async (e: FormEvent<HTMLFormElement>) => {
		setLoading(true);
		e.preventDefault();
		try {
			const res = await fetch("/api/get_results", {
				method: "POST",
				body: JSON.stringify({ query }),
			});
			const data = await res.json();

			setIntermediateSteps(
				data.intermediateSteps.map((step: any) => {
					step.observation = JSON.parse(step.observation);
					return step;
				})
			);
			setResults(data.results);
			setLoading(false);
		} catch (err) {
			console.error("Fetch error:", err);
		}
	};

	return (
		<>
			<form
				onSubmit={getResults}
				className="flex items-center justify-center w-4/5 gap-4"
			>
				<div className="relative w-full h-full">
					<TextareaAutosize
						value={query}
						autoFocus={true}
						onChange={(e) => setQuery(e.target.value)}
						className="w-full h-full p-4 transition-colors border rounded disabled:animate-pulse border-neutral-400 dark:bg-neutral-700 focus:outline-none min-h-fit"
						placeholder="Ask anything..."
					/>
					<button
						disabled={loading}
						type="submit"
						className="absolute inset-y-4 right-4"
					>
						<SearchIcon />
					</button>
				</div>
				<button
					disabled={loading}
					type="submit"
					className="px-4 py-2 text-white transition-colors bg-blue-500 rounded disabled:bg-neutral-300 disabled:text-black disabled:border disabled:border-neutral-400 hover:bg-blue-600"
				>
					Search
				</button>
			</form>
			<div className="flex gap-2">
				{results && (
					<div className="w-2/3 p-2">
						<h2 className="pb-2 text-lg font-medium">Results</h2>
						{results}
					</div>
				)}
				{intermediateSteps.length > 0 && (
					<div className="w-1/3 p-2">
						<References intermediateSteps={intermediateSteps} />
					</div>
				)}
			</div>
		</>
	);
}
