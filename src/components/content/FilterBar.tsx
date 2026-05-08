import { KeyboardEvent } from 'react';

import { GradientBorder } from '../ui/GradientBorder';

interface FilterCategory {
	label: string;
	value: string;
}

interface FilterBarProps {
	categories: FilterCategory[];
	selectedCategory: string;
	searchTerm: string;
	onCategoryChange: (value: string) => void;
	onSearchChange: (value: string) => void;
	onSearchSubmit: () => void;
	categoriesLoading?: boolean;
}

export default function FilterBar({
	categories,
	selectedCategory,
	searchTerm,
	onCategoryChange,
	onSearchChange,
	onSearchSubmit,
	categoriesLoading = false,
}: FilterBarProps) {
	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			onSearchSubmit();
		}
	};

	return (
		<div className="mb-12 w-full md:mb-16 lg:mb-20">
			<div className="mx-auto mb-8 max-w-4xl overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] md:mb-10 [&::-webkit-scrollbar]:hidden">
				<div className="inline-flex min-w-full border-b border-white/25 px-2">
					{categories.map((item) => {
						const active = selectedCategory === item.value;
						return (
							<button
								key={item.value}
								type="button"
								onClick={() => onCategoryChange(item.value)}
								disabled={categoriesLoading}
								className={`relative z-10 flex-1 whitespace-nowrap px-4 pb-4 text-center text-base font-medium tracking-wide transition sm:px-5 sm:text-lg md:px-6 md:text-xl ${
									active ? 'text-white' : 'text-white/70 hover:text-white'
								} disabled:cursor-not-allowed disabled:opacity-50`}
							>
								{item.label}
								{active && !categoriesLoading && (
									<span className="absolute -bottom-[1px] left-0 flex w-full justify-center">
										<span className="h-[2px] w-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
									</span>
								)}
							</button>
						);
					})}
				</div>
			</div>

			<div className="relative mx-auto max-w-4xl rounded-2xl">
				<GradientBorder thickness={1} radius="16px" />
				<div className="relative z-10 flex h-[58px] w-full items-center rounded-[16px] bg-transparent px-3 sm:h-[68px] sm:px-4">
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => onSearchChange(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Search Here..."
						className="h-full w-full bg-transparent px-3 text-base text-white outline-none placeholder:text-white/40 sm:px-4 sm:text-lg"
					/>
					<button
						type="button"
						onClick={onSearchSubmit}
						className="flex h-10 w-10 items-center justify-center rounded-full text-white/50 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 sm:h-12 sm:w-12"
					>
						<svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M21 21L16.65 16.65"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
}
