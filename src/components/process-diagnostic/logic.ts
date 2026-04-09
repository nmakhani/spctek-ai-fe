import type { Category, FormData, Pointer } from './types';

export function calculateScore(f: FormData) {
	let score = 100;

	if (f.sopLocation === 'Heads') score -= 22;
	else if (f.sopLocation === 'Slack') score -= 14;
	else if (f.sopLocation === 'Docs') score -= 6;

	if (f.toolIntegration === 'Manual') score -= 20;
	else if (f.toolIntegration === 'Zapier') score -= 10;

	if (f.founderBottleneck === 'Everything') score -= 20;
	else if (f.founderBottleneck === 'Some') score -= 8;

	if (f.decisionMaking === 'Founder') score -= 10;
	else if (f.decisionMaking === 'Leads') score -= 4;

	if (f.onboardingTime === 'Long') score -= 8;
	else if (f.onboardingTime === 'Medium') score -= 4;

	if (f.customerComms === 'Manual') score -= 10;
	else if (f.customerComms === 'Outsourced') score -= 6;
	else if (f.customerComms === 'Partial') score -= 2;

	if (f.timeWasted === '10+') score -= 7;
	else if (f.timeWasted === '5-10') score -= 4;
	else if (f.timeWasted === '2-5') score -= 2;

	return Math.min(90, Math.max(20, score));
}

export function getCategory(score: number): Category {
	if (score >= 76)
		return {
			label: 'Well-Organized',
			color: 'text-green',
			border: 'border-green',
			glow: 'rgba(52,211,153,0.3)',
			desc: 'Your systems are relatively healthy — targeted automation would compound your gains significantly.',
		};
	if (score >= 51)
		return {
			label: 'Fragmented & Founder-Dependent',
			color: 'text-amber',
			border: 'border-amber',
			glow: 'rgba(251,191,36,0.3)',
			desc: "You're growing, but fragile. One departure or mistake can cascade quickly without better systems.",
		};
	return {
		label: 'Chaos Mode (High Risk)',
		color: 'text-rose',
		border: 'border-rose',
		glow: 'rgba(251,113,133,0.3)',
		desc: "You're running on manual effort. Every day without automation is a hidden revenue leak.",
	};
}

export function buildPointers(f: FormData): Pointer[] {
	type ScoredPointer = Pointer & { severity: number };
	const pool: ScoredPointer[] = [];

	if (f.sopLocation === 'Heads') {
		pool.push({
			title: 'Knowledge Leakage & Bus-Factor Risk',
			body: `Your critical processes exist only in people's minds. One resignation, sick day, or bad hire creates an immediate operational crisis. You cannot reliably scale, delegate, or automate what hasn't been defined — this is the single most common hidden growth blocker for ${f.teamSize === 'Solo' ? 'founder-led businesses' : `teams of ${f.teamSize}`}.`,
			cost: '~8–15 hrs/week lost to redundant Q&A, re-explaining, and untracked errors.',
			accent: 'border-l-rose',
			costColor: 'text-rose',
			severity: 9,
		});
	} else if (f.sopLocation === 'Slack') {
		pool.push({
			title: 'Scattered Knowledge Architecture',
			body: `Important process knowledge buried in chat threads is effectively invisible. Teams repeat the same mistakes, onboarding takes longer than it should, and institutional knowledge drains out with every departure. For a ${f.industry} operation, inconsistent execution directly impacts customer outcomes.`,
			cost: 'Recoverable decisions take 3–5× longer than they should.',
			accent: 'border-l-amber',
			costColor: 'text-amber',
			severity: 7,
		});
	} else if (f.sopLocation === 'Docs') {
		pool.push({
			title: 'Documentation Drift',
			body: `Having docs is a start — but undated, unmaintained SOPs are often worse than none. Team members quietly follow outdated instructions and produce inconsistent results. In ${f.industry}, these silent deviations compound into quality issues that are hard to trace back to process failures.`,
			cost: "Onboarding costs 2–3× more than necessary; errors blamed on 'human mistake' are often process failures.",
			accent: 'border-l-amber',
			costColor: 'text-amber',
			severity: 5,
		});
	}

	if (f.toolIntegration === 'Manual') {
		pool.push({
			title: 'Data Fragmentation & Manual Transfer Risk',
			body: `Manual data entry between your tools creates invisible errors that compound over time — mismatched records, missed orders, billing discrepancies. These are rarely caught in real-time; they surface when a customer complains, a report is wrong, or a deadline is missed. For ${f.industry}, the downstream cost of even small data errors is significant.`,
			cost: 'Teams spend 4–10 hrs/week on data reconciliation that automation eliminates entirely.',
			accent: 'border-l-amber',
			costColor: 'text-amber',
			severity: 8,
		});
	} else if (f.toolIntegration === 'Zapier') {
		pool.push({
			title: 'Integration Fragility',
			body: 'Basic Zap-style automation breaks silently. When a workflow fails, no one notices until downstream damage appears — a missed lead, a double order, a customer who was never followed up with. Your integrations need resilient, monitored workflows with error alerting, not set-and-forget triggers.',
			cost: "Silent failures damage customer trust and revenue before they're detected.",
			accent: 'border-l-amber',
			costColor: 'text-amber',
			severity: 5,
		});
	} else {
		pool.push({
			title: 'Untapped Automation Capacity at the Workflow Edge',
			body: `Your integrations are healthy — but even well-connected stacks have a 'last mile' of manual work layered on top. An AI agent layer could eliminate repetitive human touchpoints that your current tooling can't handle for your ${f.industry} operations.`,
			cost: 'Uncaptured efficiency at the workflow edges — typically 2–4 hrs/week per team member.',
			accent: 'border-l-purple',
			costColor: 'text-purple-light',
			severity: 3,
		});
	}

	if (f.founderBottleneck === 'Everything' || f.decisionMaking === 'Founder') {
		const alreadyHas = pool.some((p) => p.title === 'The Founder Ceiling');
		if (!alreadyHas) {
			pool.push({
				title: 'The Founder Ceiling',
				body: `Your team's output is capped by a single person's availability. Every decision, review, or approval that routes back to you is a queued task blocking everyone downstream. This isn't a people problem — it's a systems problem. Decision frameworks, documented approval thresholds, and AI-assisted routing can unlock 3–5× team throughput without adding headcount.`,
				cost: 'Every hour of founder review delay is a cascading delay for your entire team.',
				accent: 'border-l-rose',
				costColor: 'text-rose',
				severity: f.founderBottleneck === 'Everything' ? 9 : 7,
			});
		}
	} else if (f.founderBottleneck === 'Some') {
		pool.push({
			title: 'Latent Founder Dependency',
			body: "You've delegated well overall — but the decisions still routing back to you will become the bottleneck as you scale. Systematize the remaining dependencies with documented approval thresholds and escalation playbooks before they compound into a ceiling.",
			cost: 'Growth at the next stage will be constrained by the decisions not yet delegated.',
			accent: 'border-l-amber',
			costColor: 'text-amber',
			severity: 4,
		});
	}

	if (f.decisionMaking === 'Leads' && f.founderBottleneck !== 'Everything') {
		pool.push({
			title: 'Key-Person Dependency at the Lead Level',
			body: 'Routing decisions through team leads without documented criteria creates a second-tier bottleneck. When your leads are on leave, unavailable, or eventually depart, their teams stall. The fix is decision frameworks — documented criteria that empower team members to move forward independently.',
			cost: 'Each unavailable lead multiplies wait time and frustration across their team.',
			accent: 'border-l-amber',
			costColor: 'text-amber',
			severity: 4,
		});
	}

	if (f.customerComms === 'Manual') {
		pool.push({
			title: 'Customer Communication Bottleneck',
			body: `Manual customer communication doesn't scale. Response times vary by who's available, tone is inconsistent across team members, and your team's bandwidth is the hard ceiling for customer satisfaction. In ${f.industry}, delayed or inconsistent responses are a direct driver of churn — often before you realize a customer is dissatisfied.`,
			cost: 'Slow/inconsistent responses are a primary cause of churn and negative public reviews.',
			accent: 'border-l-amber',
			costColor: 'text-amber',
			severity: 6,
		});
	} else if (f.customerComms === 'Outsourced') {
		pool.push({
			title: 'Outsourced Comms Quality Risk',
			body: "External support teams lack the brand context and institutional knowledge that builds lasting customer trust. Without tight SOPs, quality scoring, and AI-assisted consistency checks, outsourced communication silently erodes the brand reputation you've built.",
			cost: 'Brand inconsistency is difficult to measure until customers stop returning or leave public reviews.',
			accent: 'border-l-amber',
			costColor: 'text-amber',
			severity: 5,
		});
	} else if (f.customerComms === 'Partial') {
		pool.push({
			title: 'Inconsistent Customer Experience',
			body: "Partial automation means some customers receive fast, consistent responses while others wait for manual handling. This unpredictability undermines trust more than a universally slower manual process would, because expectations aren't set consistently.",
			cost: "Inconsistency is a hidden churn driver — customers don't complain, they just leave.",
			accent: 'border-l-amber',
			costColor: 'text-amber',
			severity: 3,
		});
	}

	if (f.timeWasted === '10+') {
		pool.push({
			title: 'Critical Manual Process Overhead',
			body: `Over 10 hours per week is consumed by repetitive, automatable work. At any team cost, this is the highest-ROI automation target in your business.${f.brokenProcess ? ` Your identified process — "${f.brokenProcess}" — is the most obvious starting point: structured, repetitive, and ripe for an AI agent.` : ' The highest-impact automations almost always target the most repetitive, least strategic tasks.'}`,
			cost: '10+ hrs/week × team cost = significant monthly overhead that AI automation eliminates.',
			accent: 'border-l-rose',
			costColor: 'text-rose',
			severity: 8,
		});
	} else if (f.timeWasted === '5-10') {
		pool.push({
			title: 'Significant Manual Process Overhead',
			body: `5–10 hours per week in manual work is above the threshold where automation ROI is immediate.${f.brokenProcess ? ` "${f.brokenProcess}" is a high-leverage target — systematizing it will likely expose 2–3 adjacent tasks that can be automated in the same pass.` : " Start with the task your team complains about most — it's usually the best automation candidate."}`,
			cost: '5–10 hrs/week on repetitive tasks represents automation ROI waiting to be captured.',
			accent: 'border-l-amber',
			costColor: 'text-amber',
			severity: 6,
		});
	} else if (f.timeWasted === '2-5') {
		pool.push({
			title: 'Latent Automation Opportunity',
			body: `Even 2–5 hours weekly represents meaningful efficiency gains.${f.brokenProcess ? ` "${f.brokenProcess}" in particular — structured, repetitive tasks like this are often the easiest to automate with immediate, measurable results.` : ' Small wins compound: automating several 30-minute tasks often frees a full working day per month.'}`,
			cost: 'Small automation wins compound into full days of reclaimed capacity each month.',
			accent: 'border-l-purple',
			costColor: 'text-purple-light',
			severity: 3,
		});
	}

	if (f.onboardingTime === 'Long') {
		pool.push({
			title: 'Slow Onboarding as a Scaling Constraint',
			body: `Long onboarding means every new hire is a temporary drag on team productivity before contributing value. Without documented SOPs and an automated training flow, you rebuild institutional knowledge from scratch with every hire — and every hire is an opportunity for silent process deviations to enter your operation.`,
			cost: 'Long onboarding delays ROI on every hire and creates compounding error-prone ramp periods.',
			accent: 'border-l-amber',
			costColor: 'text-amber',
			severity: 5,
		});
	} else if (f.onboardingTime === 'Medium') {
		pool.push({
			title: 'Onboarding Friction',
			body: 'Moderate onboarding time often signals underdocumented processes and reliance on tribal knowledge transfer from existing team members. A structured onboarding playbook with an internal AI knowledge base can cut this significantly and standardize the output of new hires from day one.',
			cost: 'Onboarding friction is directly linked to process documentation gaps and key-person dependency.',
			accent: 'border-l-amber',
			costColor: 'text-amber',
			severity: 3,
		});
	}

	if (
		f.brokenProcess &&
		f.timeWasted !== '10+' &&
		f.timeWasted !== '5-10' &&
		f.timeWasted !== '2-5'
	) {
		pool.push({
			title: 'Identified Process Ready for Automation',
			body: `You've pinpointed "${f.brokenProcess}" — this self-awareness is the critical first step. Even if overall time waste is low, automating a specifically identified process eliminates its error surface entirely and typically reveals 2–3 adjacent automation candidates immediately downstream.`,
			cost: 'Automating one named process often uncovers a cascade of related efficiency gains.',
			accent: 'border-l-cyan',
			costColor: 'text-cyan',
			severity: 4,
		});
	}

	if (pool.length === 0 || pool.every((p) => p.severity < 4)) {
		if (!pool.some((p) => p.title === 'Optimization Ceiling')) {
			pool.push({
				title: 'Optimization Ceiling',
				body: `Your operations are well-structured for your current stage — but even the best manual systems have an efficiency ceiling. The next growth phase for ${f.industry} businesses requires AI-assisted decision-making and predictive automation, not just better documentation or Zapier flows.`,
				cost: 'Without the next automation layer, efficiency gains plateau at current team size.',
				accent: 'border-l-purple',
				costColor: 'text-purple-light',
				severity: 4,
			});
		}
		if (!pool.some((p) => p.title === 'Competitive Automation Gap')) {
			pool.push({
				title: 'Competitive Automation Gap',
				body: `Competitors in ${f.industry} who are adopting AI agents and workflow automation are compounding speed and margin advantages today. The business case has shifted from 'saving money' to 'staying competitive' — and early movers are building structural advantages that are hard to reverse.`,
				cost: "Delayed AI adoption creates a widening competitive gap that's costly to close reactively.",
				accent: 'border-l-cyan',
				costColor: 'text-cyan',
				severity: 3,
			});
		}
	}

	pool.sort((a, b) => b.severity - a.severity);
	const limit = Math.min(pool.length, 4);
	return pool.slice(0, limit).map((item) => ({
		title: item.title,
		body: item.body,
		cost: item.cost,
		accent: item.accent,
		costColor: item.costColor,
	}));
}
