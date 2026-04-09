'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

import type { Category, Pointer } from './types';

type ResultsStateProps = {
	score: number;
	category: Category;
	pointers: Pointer[];
};

export default function ResultsState({ score, category, pointers }: ResultsStateProps) {
	return (
		<div>
			<div>
				<div>
					<motion.span
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.2, type: 'spring' }}
					>
						{score}
					</motion.span>
				</div>
				<div>
					<p>Process Health Score</p>
					<p>{category.label}</p>
					<p>{category.desc}</p>
				</div>
			</div>

			<h3>Top Hidden Challenges Detected</h3>
			<div>
				{pointers.map((pointer, index) => (
					<div key={index}>
						<h4>{pointer.title}</h4>
						<p>{pointer.body}</p>
						<p>Hidden Cost: {pointer.cost}</p>
					</div>
				))}
			</div>

			<div>
				<p>Ready to fix these in 30 days?</p>
				<p>
					We&apos;ll map your entire process landscape and identify which automations give you the
					fastest payback — in a single 30-min session.
				</p>
				<Link href="/#contact">Book My Free Strategy Call</Link>
				<p>No hard sell. No commitment required.</p>
			</div>
		</div>
	);
}
