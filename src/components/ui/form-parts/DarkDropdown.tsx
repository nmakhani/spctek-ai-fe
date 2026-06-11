'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { GlassGlow } from '../GlassGlow';
import { GradientBorder } from '../GradientBorder';

type DarkDropdownProps = {
	value: string;
	options: string[];
	placeholder?: string;
	onChange: (value: string) => void;
	compact?: boolean;
	menuMaxHeightClass?: string;
};

export const DarkDropdown = ({
	value,
	options,
	placeholder,
	onChange,
	compact = false,
	menuMaxHeightClass = 'max-h-56',
}: DarkDropdownProps) => {
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
		<div className={`relative ${isOpen ? 'z-[100]' : 'z-20'}`} ref={dropdownRef}>
			<GradientBorder thickness={1} radius="16px" subtle={true} />
			<GlassGlow angle={105} opacity={0.5} start={5} end={95} radius="16px" />
			<div
				className={`relative flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-2xl bg-transparent transition-all hover:bg-white/[0.04] ${
					compact ? 'px-4 py-3' : 'px-5 py-4'
				}`}
				onClick={() => setIsOpen(!isOpen)}
			>
				<span
					className={`min-w-0 truncate ${compact ? 'text-sm sm:text-base' : 'text-sm'} ${
						value ? 'text-white/90' : 'text-white/25'
					}`}
				>
					{value || placeholder}
				</span>
				<ChevronDown
					className={`h-4 w-4 shrink-0 text-white/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
					aria-hidden="true"
				/>
			</div>

			{isOpen && (
				<div
					className={`absolute left-0 top-[calc(100%+8px)] z-[110] ${menuMaxHeightClass} w-full overflow-y-auto overscroll-contain rounded-2xl border border-white/25 bg-[#0A0E17] shadow-2xl`}
				>
					{options.map((option) => (
						<div
							key={option}
							className={`cursor-pointer text-sm transition-colors hover:bg-white/10 ${
								compact ? 'px-4 py-2.5' : 'px-5 py-3'
							} ${value === option ? 'bg-white/5 text-white' : 'text-white/80'}`}
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
