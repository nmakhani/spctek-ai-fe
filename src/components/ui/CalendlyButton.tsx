'use client';

import { useState } from 'react';
import type React from 'react';

import CalendlyModal from './CalendlyModal';
import { PrimaryButton } from './PrimaryButton';

type CalendlyButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	children: React.ReactNode;
	config?: React.ComponentProps<typeof PrimaryButton>['config'];
};

export default function CalendlyButton({ children, config, ...props }: CalendlyButtonProps) {
	const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

	return (
		<>
			<PrimaryButton {...props} config={config} onClick={() => setIsCalendlyOpen(true)}>
				{children}
			</PrimaryButton>
			<CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
		</>
	);
}
