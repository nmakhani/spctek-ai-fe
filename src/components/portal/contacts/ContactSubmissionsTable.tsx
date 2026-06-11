import type { Contact, ContactSubmission, JourneyEntry } from './types';
import { hasJourneyData } from './utils';

interface ContactSubmissionsTableProps {
	contact: Contact;
	submissions: ContactSubmission[];
	onCollapse: (contactId: string) => void;
	onViewJourney: (entry: JourneyEntry) => void;
}

export function ContactSubmissionsTable({
	contact,
	submissions,
	onCollapse,
	onViewJourney,
}: ContactSubmissionsTableProps) {
	return (
		<tr className="bg-black/18 border-b border-white/10">
			<td colSpan={6} className="px-6 py-6">
				<div className="rounded-2xl border border-white/10 bg-black/20 p-4">
					<div className="mb-4 flex items-center justify-between gap-3">
						<div>
							<p className="text-sm font-semibold text-white">Contact submissions</p>
							<p className="text-xs text-white/55">
								{submissions.length} submission{submissions.length === 1 ? '' : 's'}
							</p>
						</div>
						<button
							type="button"
							onClick={(event) => {
								event.stopPropagation();
								onCollapse(contact.id);
							}}
							className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs font-medium text-white/80 transition hover:bg-white/[0.12]"
						>
							Collapse
						</button>
					</div>

					{submissions.length === 0 ? (
						<div className="text-sm text-white/55">No submissions available.</div>
					) : (
						<div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03]">
							<table className="w-full min-w-[780px] text-sm">
								<thead className="bg-black/25">
									<tr>
										<th className="px-3 py-2 text-left font-medium text-white/65">Source</th>
										<th className="px-3 py-2 text-left font-medium text-white/65">Name</th>
										<th className="px-3 py-2 text-left font-medium text-white/65">Email</th>
										<th className="px-3 py-2 text-left font-medium text-white/65">Phone</th>
										<th className="px-3 py-2 text-left font-medium text-white/65">Company</th>
										<th className="px-3 py-2 text-left font-medium text-white/65">Message</th>
										<th className="px-3 py-2 text-left font-medium text-white/65">Actions</th>
									</tr>
								</thead>
								<tbody>
									{submissions.map((submission) => (
										<tr key={submission.id} className="border-t border-white/10 align-top">
											<td className="px-3 py-2 text-white">{submission.source || '-'}</td>
											<td className="px-3 py-2 text-white">{submission.name || '-'}</td>
											<td className="px-3 py-2 text-white">{submission.email || contact.email || '-'}</td>
											<td className="px-3 py-2 text-white">{submission.phone || '-'}</td>
											<td className="px-3 py-2 text-white">{submission.company || '-'}</td>
											<td className="max-w-[280px] px-3 py-2 text-white">
												<div className="line-clamp-3 whitespace-pre-wrap">{submission.message || '-'}</div>
											</td>
											<td className="px-3 py-2">
												{hasJourneyData(submission.journey) ? (
													<button
														type="button"
														onClick={(event) => {
															event.stopPropagation();
															onViewJourney(submission);
														}}
														className="rounded-lg bg-[#10b981] px-3 py-1 text-xs font-medium text-white transition hover:bg-[#34d399]"
													>
														Track Journey
													</button>
												) : (
													<span className="text-white/45">-</span>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</td>
		</tr>
	);
}
