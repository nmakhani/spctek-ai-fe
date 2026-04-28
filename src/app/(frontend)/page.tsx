import { generateStaticMetadata } from '@/lib/metadata';
import HomePageClient from './HomePageClient';

export const generateMetadata = async () => await generateStaticMetadata('/');

export default function HomePage() {
	return <HomePageClient />;
}
