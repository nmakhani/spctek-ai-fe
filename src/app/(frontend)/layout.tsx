import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { PathPopupMount } from '@/components/ui/PathPopupMount';

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Navbar />
			<PathPopupMount />
			<main>{children}</main>
			<Footer />
		</>
	);
}
