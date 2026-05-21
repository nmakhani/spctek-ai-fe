'use client';

import { usePathname } from 'next/navigation';

import { PagePopup } from '@/components/ui/PagePopup';

export function PathPopupMount() {
	return <PagePopup pagePath={usePathname()} />;
}
