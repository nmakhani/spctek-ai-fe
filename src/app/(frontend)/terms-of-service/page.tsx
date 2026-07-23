import type { Metadata } from 'next';

import { LegalDocument } from '@/components/LegalDocument';

export const metadata: Metadata = {
	title: 'Terms of Service | SPCTEK.AI',
	description: 'Read the SPCTEK.AI Terms of Service.',
};

export default function TermsOfServicePage() {
	return <LegalDocument fileName="terms-of-service.html" />;
}
