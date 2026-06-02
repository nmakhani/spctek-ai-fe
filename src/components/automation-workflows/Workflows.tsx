'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import type { Category } from '@/components/portal/content-editor/types';
import CalendlyModal from '@/components/ui/CalendlyModal';
import FilterBar from '@/components/ui/FilterBar';
import LeadCaptureModal, { type LeadCaptureValues } from '@/components/ui/LeadCaptureModal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { automationWorkflowsApi, contactsApi } from '@/lib/api';
import { validateEstimatorContactForm } from '@/lib/validation';
import { WorkflowCard, WorkflowDetailsModal } from './WorkflowCard';

type WorkflowClass = 'system' | 'plugin';
const ITEMS_PER_PAGE = 6;

export interface AutomationWorkflow {
	id: string;
	name: string;
	teaser: string;
	class: WorkflowClass;
	description: {
		body: string;
		bullets: string[];
	};
	link?: string | null;
	thumbnail_url?: string | null;
	categories: Category[];
}

function categoryMatches(workflow: AutomationWorkflow, selectedCategory: string) {
	return selectedCategory === 'all' || workflow.categories.some((category) => category.slug === selectedCategory);
}

function searchMatches(workflow: AutomationWorkflow, searchTerm: string) {
	if (!searchTerm) {
		return true;
	}

	const target = [
		workflow.name,
		workflow.teaser,
		workflow.description.body,
		...workflow.description.bullets,
		...workflow.categories.map((category) => category.name),
	]
		.join(' ')
		.toLowerCase();

	return target.includes(searchTerm.toLowerCase());
}

export default function Workflows() {
	const filterBarRef = useRef<HTMLDivElement>(null);
	const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [searchInput, setSearchInput] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [detailWorkflow, setDetailWorkflow] = useState<AutomationWorkflow | null>(null);
	const [inquiryWorkflow, setInquiryWorkflow] = useState<AutomationWorkflow | null>(null);
	const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

	useEffect(() => {
		let isMounted = true;

		const fetchWorkflows = async () => {
			try {
				setLoading(true);
				const response = await automationWorkflowsApi.list();
				if (!isMounted) {
					return;
				}
				setWorkflows(response.data as AutomationWorkflow[]);
			} catch {
				if (isMounted) {
					setWorkflows([]);
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		};

		void fetchWorkflows();

		return () => {
			isMounted = false;
		};
	}, []);

	const filterCategories = useMemo(
		() =>
			Array.from(
				workflows
					.flatMap((workflow) => workflow.categories || [])
					.reduce((categoryMap, category) => categoryMap.set(category.slug, category.name), new Map<string, string>())
			).map(([value, label]) => ({ label, value })),
		[workflows]
	);

	useEffect(() => {
		if (selectedCategory !== 'all' && !filterCategories.some((category) => category.value === selectedCategory)) {
			setSelectedCategory('all');
		}
	}, [filterCategories, selectedCategory]);

	const filteredWorkflows = useMemo(
		() =>
			workflows.filter(
				(workflow) => categoryMatches(workflow, selectedCategory) && searchMatches(workflow, searchTerm)
			),
		[searchTerm, selectedCategory, workflows]
	);
	const totalPages = Math.max(1, Math.ceil(filteredWorkflows.length / ITEMS_PER_PAGE));
	const sliderSegmentWidth = `${100 / totalPages}%`;
	const sliderSegmentLeft = `${((currentPage - 1) / totalPages) * 100}%`;
	const paginatedWorkflows = useMemo(
		() => filteredWorkflows.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
		[currentPage, filteredWorkflows]
	);

	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, selectedCategory]);

	useEffect(() => {
		if (currentPage > totalPages) {
			setCurrentPage(totalPages);
		}
	}, [currentPage, totalPages]);

	const handleCategoryChange = (value: string) => {
		setSelectedCategory(value);
	};

	const handleSearchSubmit = () => {
		setSearchTerm(searchInput.trim());
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		filterBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};

	const handleWorkflowInquire = (workflow: AutomationWorkflow) => {
		setDetailWorkflow(null);

		if (workflow.link?.trim()) {
			setInquiryWorkflow(workflow);
			return;
		}

		setIsCalendlyOpen(true);
	};

	const handleWorkflowLeadSubmit = async (values: LeadCaptureValues) => {
		if (!inquiryWorkflow?.link) {
			return;
		}

		await contactsApi.create({
			name: values.name,
			email: values.email,
			phone: values.phone || null,
			company: values.company || null,
			source: 'automation_workflow',
			message: `Workflow implementation inquiry: ${inquiryWorkflow.name}`,
			journey: {
				workflow_id: inquiryWorkflow.id,
				workflow_name: inquiryWorkflow.name,
				workflow_link: inquiryWorkflow.link,
			},
		});

		toast.success('Thank you. Redirecting now...');
		window.open(inquiryWorkflow.link, '_blank', 'noopener, noreferrer');
		setInquiryWorkflow(null);
	};

	return (
		<section className="font-poppins mx-auto flex max-w-7xl flex-col items-center px-4 text-center md:px-6 lg:px-12">
			<SectionHeading size="large">
				<span className="text-[#606bfa]">Premium and Ready-to-Use</span>
				<br /> Automation Systems for Every Stage <br /> of <span className="text-[#606bfa]">Business Growth</span>
			</SectionHeading>

			<div ref={filterBarRef} className="mt-12 w-full scroll-mt-6 md:mt-16">
				<FilterBar
					categories={filterCategories}
					selectedCategory={selectedCategory}
					searchTerm={searchInput}
					onCategoryChange={handleCategoryChange}
					onSearchChange={setSearchInput}
					onSearchSubmit={handleSearchSubmit}
					categoriesLoading={loading}
				/>
			</div>

			<p className="font-poppins mb-12 max-w-[900px] text-base font-light leading-relaxed text-white sm:text-lg md:text-xl lg:text-2xl">
				From production-grade operational systems to plug-and-play workflows, SPCTEK.AI automations are designed to
				simplify processes, improve execution, and support scalable business operations.
			</p>

			<div className="w-full">
				{loading ? (
					<div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center text-white/60">
						Loading automation systems...
					</div>
				) : filteredWorkflows.length === 0 ? (
					<div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center text-white/60">
						No automation systems found.
					</div>
				) : (
					<>
						<div className="grid grid-cols-1 gap-x-8 gap-y-9 text-left md:grid-cols-2 xl:grid-cols-3">
							{paginatedWorkflows.map((workflow) => (
								<WorkflowCard key={workflow.id} workflow={workflow} onSelect={setDetailWorkflow} />
							))}
						</div>

						{totalPages > 1 && (
							<div className="mx-auto mt-10 flex w-full max-w-xl flex-col items-center gap-3">
								<div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
									Page {currentPage} of {totalPages}
								</div>
								<div className="relative h-3 w-full rounded-full bg-white/15">
									<div
										className="absolute inset-y-0 rounded-full bg-[#606bfa] shadow-[0_0_18px_rgba(96,107,250,0.45)] transition-[left,width] duration-300"
										style={{ left: sliderSegmentLeft, width: sliderSegmentWidth }}
									/>
									<input
										type="range"
										min={1}
										max={totalPages}
										step={1}
										value={currentPage}
										onChange={(event) => handlePageChange(Number(event.target.value))}
										className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0"
									/>
								</div>
							</div>
						)}
					</>
				)}
			</div>

			<WorkflowDetailsModal
				workflow={detailWorkflow}
				onClose={() => setDetailWorkflow(null)}
				onInquire={handleWorkflowInquire}
			/>

			<LeadCaptureModal
				isOpen={Boolean(inquiryWorkflow)}
				title="One Last Step"
				subtitle="Enter your details before opening this workflow resource."
				submitLabel="Continue"
				loadingLabel="Opening..."
				validate={validateEstimatorContactForm}
				onClose={() => setInquiryWorkflow(null)}
				onSubmit={handleWorkflowLeadSubmit}
			/>

			<CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
		</section>
	);
}
