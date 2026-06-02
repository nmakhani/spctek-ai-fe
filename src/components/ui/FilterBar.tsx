import { KeyboardEvent, useEffect, useRef, useState } from 'react';

import { GradientBorder } from './GradientBorder';

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
	const scrollRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);
	const visibleCategories = categoriesLoading
		? [{ label: 'Loading categories...', value: 'all' }]
		: [{ label: 'All', value: 'all' }, ...categories];

	useEffect(() => {
		const scrollElement = scrollRef.current;
		if (!scrollElement) {
			return;
		}

		const updateScrollHints = () => {
			const { scrollLeft, scrollWidth, clientWidth } = scrollElement;
			const maxScrollLeft = scrollWidth - clientWidth;

			setCanScrollLeft(scrollLeft > 1);
			setCanScrollRight(scrollLeft < maxScrollLeft - 1);
		};

		updateScrollHints();
		scrollElement.addEventListener('scroll', updateScrollHints, { passive: true });
		window.addEventListener('resize', updateScrollHints);

		return () => {
			scrollElement.removeEventListener('scroll', updateScrollHints);
			window.removeEventListener('resize', updateScrollHints);
		};
	}, [categories.length, categoriesLoading]);

	return (
		<div className="mb-12 w-full md:mb-16 lg:mb-20">
			<div className="mx-auto mb-8 grid max-w-5xl grid-cols-[2rem_minmax(0,56rem)_2rem] items-center justify-center gap-2 md:mb-10 md:grid-cols-[2.5rem_minmax(0,56rem)_2.5rem]">
				<div className="flex h-full items-center justify-start">
					{canScrollLeft && (
						<svg
							aria-hidden="true"
							className="h-7 w-7 animate-pulse text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M15 6L9 12L15 18"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					)}
				</div>
				<div
					ref={scrollRef}
					className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
				>
					<div className="inline-flex min-w-full border-b border-white/25 px-2">
						{visibleCategories.map((item) => {
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
				<div className="flex h-full items-center justify-end">
					{canScrollRight && (
						<svg
							aria-hidden="true"
							className="h-7 w-7 animate-pulse text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M9 6L15 12L9 18"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					)}
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
