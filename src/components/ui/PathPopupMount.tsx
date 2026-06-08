'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const PagePopup = dynamic(() => import('@/components/ui/PagePopup').then((mod) => mod.PagePopup), {
	ssr: false,
});

export function PathPopupMount() {
	const pagePath = usePathname();
	const [readyPath, setReadyPath] = useState<string | null>(null);

	useEffect(() => {
		if ('requestIdleCallback' in window) {
			const idleId = window.requestIdleCallback(() => setReadyPath(pagePath), { timeout: 2500 });
			return () => window.cancelIdleCallback(idleId);
		}

		const timerId = globalThis.setTimeout(() => setReadyPath(pagePath), 1500);
		return () => globalThis.clearTimeout(timerId);
	}, [pagePath]);

	if (readyPath !== pagePath) {
		return null;
	}

	return <PagePopup pagePath={pagePath} />;
}
