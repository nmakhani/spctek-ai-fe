import type { Metadata } from 'next';

import { LegalDocument } from '@/components/LegalDocument';

export const metadata: Metadata = {
	title: 'Privacy Policy | SPCTEK.AI',
	description: 'Read the SPCTEK.AI Privacy Policy.',
};

export default function PrivacyPolicyPage() {
	return <LegalDocument fileName="privacy-policy.html" />;
}
