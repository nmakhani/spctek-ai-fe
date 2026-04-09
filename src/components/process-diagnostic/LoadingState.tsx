'use client';

import { motion } from 'framer-motion';

type LoadingStateProps = {
	message: string;
};

export default function LoadingState({ message }: LoadingStateProps) {
	return (
		<div>
			<div>
				<div>
					<div />
					<div />
					<div />
				</div>
			</div>
			<h3>Analyzing Your Process Architecture</h3>
			<motion.p key={message} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
				{message}
			</motion.p>
		</div>
	);
}
