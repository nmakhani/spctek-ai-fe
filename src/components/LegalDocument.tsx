import { readFile } from 'node:fs/promises';
import path from 'node:path';

interface LegalDocumentProps {
	fileName: 'privacy-policy.html' | 'terms-of-service.html';
}

export async function LegalDocument({ fileName }: LegalDocumentProps) {
	const documentHtml = await readFile(path.join(process.cwd(), 'src', 'data', fileName), 'utf8');

	return (
		<div className="noise-overlay relative min-h-screen overflow-hidden px-5 py-20 sm:px-8 lg:py-28">
			<div className="pointer-events-none absolute inset-x-0 top-0 h-[38rem] bg-[radial-gradient(ellipse_at_top,rgba(96,107,250,0.24),transparent_68%)]" />
			<div className="pointer-events-none absolute -right-40 top-80 h-96 w-96 rounded-full bg-brand-secondary/10 blur-3xl" />

			<article className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-white/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.09),rgba(255,255,255,0.035))] p-7 shadow-[0_28px_90px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.13)] backdrop-blur-2xl sm:p-11 lg:p-16">
				<div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-secondary"></div>
				<div
					className="font-poppins prose-h3:font-poppins prose prose-invert max-w-none text-[0.97rem] font-light leading-8 text-white/75 prose-h1:mb-3 prose-h1:font-heading prose-h1:text-4xl prose-h1:font-bold prose-h1:tracking-tight prose-h1:text-white prose-h2:mb-4 prose-h2:mt-12 prose-h2:border-l-2 prose-h2:border-brand-primary prose-h2:pl-4 prose-h2:font-heading prose-h2:text-2xl prose-h2:font-bold prose-h2:leading-tight prose-h2:text-white prose-h3:mb-2 prose-h3:mt-7 prose-h3:text-base prose-h3:font-semibold prose-h3:text-white prose-p:my-4 prose-p:max-w-none prose-a:text-brand-secondary prose-a:transition hover:prose-a:text-white prose-ul:my-5 prose-ul:list-none prose-ul:pl-0 prose-li:relative prose-li:my-2 prose-li:pl-6 prose-li:before:absolute prose-li:before:left-0 prose-li:before:top-[0.85rem] prose-li:before:h-1.5 prose-li:before:w-1.5 prose-li:before:rounded-full prose-li:before:bg-brand-secondary sm:prose-h1:text-5xl sm:prose-h2:text-3xl [&_.legal-dates]:mb-10 [&_.legal-dates]:border-b [&_.legal-dates]:border-white/10 [&_.legal-dates]:pb-8 [&_.legal-dates]:text-sm [&_.legal-dates]:font-medium [&_.legal-dates]:leading-7 [&_.legal-dates]:text-white/50"
					dangerouslySetInnerHTML={{ __html: documentHtml }}
				/>
			</article>
		</div>
	);
}
