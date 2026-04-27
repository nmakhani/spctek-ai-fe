import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Navbar />
			<main className="overflow-x-hidden">{children}</main>
			<Footer />
		</>
	);
}
