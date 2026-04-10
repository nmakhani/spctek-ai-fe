'use client';

import { useEffect, useRef, useState } from 'react';

import { GlassGlow } from '../GlassGlow';
import { GradientBorder } from '../GradientBorder';

type DarkDropdownProps = {
	value: string;
	options: string[];
	placeholder?: string;
	onChange: (value: string) => void;
};

export const DarkDropdown = ({ value, options, placeholder, onChange }: DarkDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<div className="relative z-20" ref={dropdownRef}>
			<GradientBorder thickness={1} radius="16px" subtle={true} />
			<GlassGlow angle={105} opacity={0.5} start={5} end={95} radius="16px" />
			<div
				className="relative flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-2xl bg-transparent px-5 py-4 transition-all"
				onClick={() => setIsOpen(!isOpen)}
			>
				<span className="text-sm text-white/90">{value || placeholder}</span>
				<svg
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
				>
					<path
						d="M6 9L12 15L18 9"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="text-gray-400"
					/>
				</svg>
			</div>

			{isOpen && (
				<div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full overflow-hidden rounded-2xl border border-white/40 bg-[#0A0E17] shadow-xl">
					{options.map((option) => (
						<div
							key={option}
							className={`cursor-pointer px-5 py-3 text-sm transition-colors hover:bg-white/10 ${
								value === option ? 'bg-white/5 text-white' : 'text-white/80'
							}`}
							onClick={() => {
								onChange(option);
								setIsOpen(false);
							}}
						>
							{option}
						</div>
					))}
				</div>
			)}
		</div>
	);
};
