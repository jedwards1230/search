"use client";

export default function Pagination({
	currentPage,
	totalPages,
	onPageChange,
}: {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}) {
	return (
		<div className="flex justify-center w-full gap-4 px-4 border rounded-lg">
			{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
				<button
					key={page}
					onClick={() => onPageChange(page)}
					disabled={page === currentPage}
					className="p-2 no-underline rounded-md hover:underline disabled:underline disabled:font-medium"
				>
					{page}
				</button>
			))}
		</div>
	);
}
