import './globals.css';

import type { Metadata } from 'next';

import { ToastProvider } from '@/components/ui/ToastProvider';

export const metadata: Metadata = {
	title: 'SPCTEK AI - Build a System. Not a Spreadsheet.',
	description: 'AI-native operations platform.',
	icons: { icon: '/favicon-dark.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="dark">
			<head>
				{/* Google Tag Manager */}
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MD27LC69');`,
					}}
				/>
				{/* End Google Tag Manager */}
			</head>
			<body className="bg-[#020617] text-white antialiased">
				{/* Google Tag Manager (noscript) */}
				<noscript>
					<iframe
						src="https://www.googletagmanager.com/ns.html?id=GTM-MD27LC69"
						style={{ display: 'none', visibility: 'hidden' }}
						height="0"
						width="0"
					/>
				</noscript>
				{/* End Google Tag Manager (noscript) */}
				<ToastProvider />
				{children}
			</body>
		</html>
	);
}
