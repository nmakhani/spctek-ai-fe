import './globals.css';

import { GoogleTagManager } from '@next/third-parties/google';
import type { Metadata } from 'next';
import Script from 'next/script';

import { ToastProvider } from '@/components/ui/ToastProvider';

export const metadata: Metadata = {
	title: 'SPCTEK AI - Build a System. Not a Spreadsheet.',
	description: 'AI-native operations platform.',
	icons: { icon: '/favicon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="dark">
			<GoogleTagManager gtmId="GTM-MD27LC69" />

			<body className="text-white antialiased">
				{/* Klaviyo Tracking Script */}
				<Script
					async
					src="https://static.klaviyo.com/onsite/js/Ykyhnt/klaviyo.js?company_id=Ykyhnt"
					strategy="afterInteractive"
				/>

				<Script id="klaviyo-init" strategy="afterInteractive">
					{`
						!function(){
							if(!window.klaviyo){
								window._klOnsite=window._klOnsite||[];
								try{
									window.klaviyo=new Proxy({},{
										get:function(n,i){
											return "push"===i
											?function(){
												var n;
												(n=window._klOnsite).push.apply(n,arguments)
											}
											:function(){
												for(var n=arguments.length,o=new Array(n),w=0;w<n;w++)
													o[w]=arguments[w];
												var t="function"==typeof o[o.length-1]?o.pop():void 0,
												e=new Promise((function(n){
													window._klOnsite.push([i].concat(o,[function(i){
														t&&t(i),n(i)
													}]))
												}));
												return e
											}
										}
									})
								}catch(n){
									window.klaviyo=window.klaviyo||[],
									window.klaviyo.push=function(){
										var n;
										(n=window._klOnsite).push.apply(n,arguments)
									}
								}
							}
						}();
					`}
				</Script>

				<ToastProvider />
				{children}
			</body>
		</html>
	);
}
