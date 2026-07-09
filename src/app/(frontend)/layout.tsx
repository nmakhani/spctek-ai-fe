import Script from 'next/script';

import ChatWidget from '@/components/chat/ChatWidget';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { PathPopupMount } from '@/components/ui/PathPopupMount';

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
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

			<Navbar />
			<PathPopupMount />
			<main>{children}</main>
			<Footer />
			<ChatWidget />
		</>
	);
}
