'use client';

import { useState, useRef, useEffect } from 'react';
import RadioCard from './RadioCard';
import { GlassGlow } from '../../ui/GlassGlow';
import { GradientBorder } from '../../ui/GradientBorder';
import { FormData, Step } from './types';

type Step1Props = {
	form: FormData;
	onChange: (name: keyof FormData, value: string) => void;
	onNext: (step: Step) => void;
};

const MOTIVE_OPTIONS = [
	'Scaling without burnout',
	'Reducing manual errors',
	'Freeing up founder time',
	'Building repeatable processes',
	'Reducing operational costs',
];

export default function Step1({ form, onChange, onNext }: Step1Props) {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsDropdownOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<div className="flex flex-col gap-10">
			<div>
				<h2 className="mb-2 text-2xl font-semibold tracking-tight text-white">
					Operational Baseline
				</h2>
				<p className="text-gray-400 text-sm">Tell us a bit about your team and goals.</p>
			</div>

			<div className="flex flex-col gap-3">
				<label className="text-sm font-semibold text-white">
					What is your primary goal right now?
				</label>
				<div className="relative z-20" ref={dropdownRef}>
					<GradientBorder thickness={1} radius="16px" subtle={true} />
					<GlassGlow angle={105} opacity={0.5} start={5} end={95} radius="16px" />
					<div
						className="relative flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-2xl bg-transparent px-5 py-4 transition-all"
						onClick={() => setIsDropdownOpen(!isDropdownOpen)}
					>
						<span className="text-sm text-white/90">
							{form.motive || 'Scaling without burnout'}
						</span>
						<svg
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className={`transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
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

					{isDropdownOpen && (
						<div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full overflow-hidden rounded-2xl border border-white/40 bg-[#0A0E17] shadow-xl">
							{MOTIVE_OPTIONS.map((option) => (
								<div
									key={option}
									className={`cursor-pointer px-5 py-3 text-sm transition-colors hover:bg-white/10 ${
										form.motive === option ? 'bg-white/5 text-white' : 'text-white/80'
									}`}
									onClick={() => {
										onChange('motive', option);
										setIsDropdownOpen(false);
									}}
								>
									{option}
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<label className="text-sm font-semibold text-white">Team Size</label>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{[
						{ v: 'Solo', l: 'Solo - 5', d: 'Founder-led' },
						{ v: '6-15', l: '6-15', d: 'Growing Team' },
						{ v: '16+', l: '16+', d: 'Established' },
					].map(({ v, l, d }) => (
						<RadioCard
							key={v}
							name="teamSize"
							value={v}
							current={form.teamSize}
							label={l}
							desc={d}
							onChange={onChange}
						/>
					))}
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<label className="text-sm font-semibold text-white">Industry / Vertical</label>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{[
						{ v: 'eCommerce', l: 'eCommerce' },
						{ v: 'Agency/Services', l: 'Agency / Services' },
						{ v: 'SaaS', l: 'SaaS / Tech' },
						{ v: 'Professional Services', l: 'Professional Services' },
						{ v: 'Logistics', l: 'Logistics' },
						{ v: 'Other', l: 'Other' },
					].map(({ v, l }) => (
						<RadioCard
							key={v}
							name="industry"
							value={v}
							current={form.industry}
							label={l}
							onChange={onChange}
						/>
					))}
				</div>
			</div>

			<div className="pt-6">
				<button
					type="button"
					onClick={() => onNext(2)}
					className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5A5DF3] px-6 py-4 font-medium text-white transition-colors duration-200 hover:bg-[#4d50d6]"
				>
					Next: Knowledge Systems <span className="ml-1">→</span>
				</button>
			</div>
		</div>
	);
}
