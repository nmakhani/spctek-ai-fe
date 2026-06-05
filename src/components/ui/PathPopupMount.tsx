'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const PagePopup = dynamic(() => import('@/components/ui/PagePopup').then((mod) => mod.PagePopup), {
	ssr: false,
});

export function PathPopupMount() {
	const pagePath = usePathname();
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		setIsReady(false);

		if ('requestIdleCallback' in window) {
			const idleId = window.requestIdleCallback(() => setIsReady(true), { timeout: 2500 });
			return () => window.cancelIdleCallback(idleId);
		}

		const timerId = globalThis.setTimeout(() => setIsReady(true), 1500);
		return () => globalThis.clearTimeout(timerId);
	}, [pagePath]);

	if (!isReady) {
		return null;
	}

	return <PagePopup pagePath={pagePath} />;
}
