'use client';

import type { PlaybookRecommendation } from './types';

type ResultsStateProps = {
	recommendation: PlaybookRecommendation | null;
};

export default function ResultsState({ recommendation }: ResultsStateProps) {
	if (!recommendation) return null;

	return (
		<div className="flex flex-col gap-10 text-center">
			<div className="mx-auto mt-2 max-w-2xl">
				<div className="flex flex-col items-center gap-4 rounded-[23px]">
					<h2 className="text-3xl font-bold text-white">{recommendation.title}</h2>
					<p className="text-gray-300 text-lg leading-relaxed">{recommendation.message}</p>
				</div>
			</div>
		</div>
	);
}
