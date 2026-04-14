'use client';

import { motion } from 'framer-motion';

export default function FormLoadingState({ message, title }: { message: string; title: string }) {
	return (
		<div className="flex min-h-[400px] flex-col items-center justify-center gap-8 py-10 text-center">
			<div className="relative flex h-24 w-24 items-center justify-center">
				<div className="absolute inset-0 animate-pulse rounded-full bg-[#606bfa]/20 blur-2xl" />
				<svg className="absolute inset-0 h-full w-full animate-spin text-white/5" viewBox="0 0 100 100">
					<circle cx="50" cy="50" r="46" fill="none" strokeWidth="8" stroke="currentColor" />
				</svg>
				<svg
					className="absolute inset-0 h-full w-full animate-spin text-[#606bfa] drop-shadow-[0_0_10px_rgba(96,107,250,0.8)]"
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
				<h3 className="text-[28px] font-bold tracking-tight text-[#606bfa]">{title}</h3>
				<div className="h-8">
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
