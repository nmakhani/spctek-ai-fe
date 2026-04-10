'use client';

import { motion } from 'framer-motion';

type LoadingStateProps = {
	message: string;
};

export default function LoadingState({ message }: LoadingStateProps) {
	return (
		<div className="flex min-h-[400px] flex-col items-center justify-center gap-8 py-10 text-center">
			<div className="relative flex h-24 w-24 items-center justify-center">
				{/* Inner Glowing Backdrop */}
				<div className="absolute inset-0 animate-pulse rounded-full bg-[#25C4D8]/20 blur-2xl" />

				{/* Spinner Ring */}
				<svg
					className="absolute inset-0 h-full w-full animate-spin text-white/5"
					viewBox="0 0 100 100"
				>
					<circle cx="50" cy="50" r="46" fill="none" strokeWidth="8" stroke="currentColor" />
				</svg>

				{/* Animated Rotating Segment (Cyan) */}
				<svg
					className="absolute inset-0 h-full w-full animate-spin text-[#25C4D8] drop-shadow-[0_0_10px_rgba(37,196,216,0.8)]"
					viewBox="0 0 100 100"
					style={{ animationDuration: '1.5s' }}
				>
					<circle
						cx="50"
						cy="50"
						r="46"
						fill="none"
						strokeWidth="8"
						stroke="currentColor"
						strokeLinecap="round"
						strokeDasharray="290"
						strokeDashoffset="220"
					/>
				</svg>
			</div>

			<div className="flex flex-col gap-3">
				<h3 className="text-[28px] font-bold tracking-tight text-[#25C4D8]">
					Analyzing Process Architecture...
				</h3>
				<div className="h-8">
					{' '}
					{/* Fixed height to avoid layout shift */}
					<motion.p
						key={message}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="text-gray-300 text-lg font-medium"
					>
						{message}
					</motion.p>
				</div>
			</div>
		</div>
	);
}
