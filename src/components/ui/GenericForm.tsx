'use client';

import React, { useState } from 'react';

export type FieldType = 'text' | 'email' | 'tel' | 'textarea' | 'action' | 'date';

export interface FieldConfig {
	name: string;
	type: FieldType;
	label: string;
	subtext?: string;
	placeholder?: string;
	required?: boolean;
	actionLabel?: string;
	onAction?: () => void;
	gridSpan?: 'half' | 'full';
	rows?: number;
}

export interface FormValues {
	[key: string]: string;
}

export interface FormErrors {
	[key: string]: string | undefined;
	submit?: string;
}

export type ValidateFn = (values: FormValues) => FormErrors;

interface GenericFormProps {
	fields: FieldConfig[];
	initialValues?: FormValues;
	validate?: ValidateFn;
	onSubmit?: (values: FormValues) => Promise<void>;
	clearable?: boolean;
	submitLabel?: string;
	loadingLabel?: string;
}

const labelClass = 'mb-2 block text-white text-lg font-semibold md:text-2xl';
const errorClass = 'mt-1 text-sm text-red-400';

function GradientBorder({
	children,
	hasError = false,
	thickness = 1,
	radius = '1rem',
	type = 'default',
}: {
	children: React.ReactNode;
	hasError?: boolean;
	thickness?: number;
	radius?: string;
	type?: 'default' | 'subtle';
}) {
	const defaultGradient = hasError
		? 'linear-gradient(135deg, rgba(248,113,113,0.85) 0%, #a0a6fc 50%, rgba(248,113,113,0.85) 100%)'
		: 'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, #a0a6fc 50%, rgba(255,255,255,0.75) 100%)';

	const subtleGradient = hasError
		? 'linear-gradient(135deg, rgba(248,113,113,0.85) 0%, rgba(255,255,255,0.25) 50%, rgba(248,113,113,0.85) 100%)'
		: 'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.75) 100%)';

	const gradient = type === 'subtle' ? subtleGradient : defaultGradient;

	return (
		<div className="relative overflow-hidden" style={{ borderRadius: radius }}>
			<div
				className="pointer-events-none absolute inset-0"
				style={{
					padding: thickness,
					borderRadius: radius,
					background: gradient,
					WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
					WebkitMaskComposite: 'destination-out',
					maskComposite: 'exclude',
				}}
			/>

			<div className="relative z-10">{children}</div>
		</div>
	);
}

const inputInnerClass =
	'w-full bg-transparent px-5 py-4 text-base text-white/90 placeholder:text-white/25 outline-none focus:ring-0 transition-all resize-none';

export default function GenericForm({
	fields,
	initialValues,
	validate,
	onSubmit,
	clearable = false,
	submitLabel = 'Submit',
	loadingLabel = 'Submitting...',
}: GenericFormProps) {
	const defaultValues = fields.reduce<FormValues>((acc, f) => {
		acc[f.name] = initialValues?.[f.name] ?? '';
		return acc;
	}, {});

	const [values, setValues] = useState<FormValues>(defaultValues);
	const [errors, setErrors] = useState<FormErrors>({});
	const [loading, setLoading] = useState(false);

	const handleChange = (name: string, value: string) =>
		setValues((prev) => ({ ...prev, [name]: value }));

	const handleClear = () => {
		setValues(defaultValues);
		setErrors({});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const validationErrors = validate?.(values);
		setErrors(validationErrors || {});

		if (Object.keys(validationErrors || {}).length > 0) return;

		try {
			setLoading(true);
			setErrors({});
			if (onSubmit) {
				await onSubmit(values);
			}
			setValues(defaultValues);
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to submit form';
			setErrors({ submit: message });
		} finally {
			setLoading(false);
		}
	};

	const renderField = (field: FieldConfig) => {
		const hasError = Boolean(errors[field.name]);
		const isFullWidth = field.gridSpan === 'full';
		const spanClass = isFullWidth ? 'md:col-span-2' : 'md:col-span-1';

		const sharedProps = {
			placeholder: field.placeholder,
			disabled: loading,
			value: values[field.name],
			onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
				handleChange(field.name, e.target.value),
		};

		return (
			<div key={field.name} className={spanClass}>
				<label className={labelClass}>
					{field.label} {field.required && <span className="text-red-400">*</span>}
				</label>

				<GradientBorder hasError={hasError} thickness={1} radius="1rem" type="subtle">
					<div
						className="pointer-events-none absolute inset-0"
						style={{
							background: `linear-gradient(105deg, rgba(255, 255, 255, 0.5) 0%, transparent 4%, transparent 96%, rgba(255, 255, 255, 0.5) 100%)`,
						}}
					/>
					<div style={{ overflow: 'hidden' }}>
						{field.type === 'action' ? (
							<button
								type="button"
								disabled={loading}
								onClick={field.onAction}
								className="flex w-full items-center justify-between px-5 py-4 text-lg font-medium transition-all hover:bg-white/5 active:bg-white/10"
							>
								<span className="text-white/60">{field.placeholder}</span>
								<span className="text-white/30">{field.actionLabel}</span>
							</button>
						) : field.type === 'textarea' ? (
							<textarea rows={field.rows ?? 4} className={inputInnerClass} {...sharedProps} />
						) : (
							<input type={field.type} className={inputInnerClass} {...sharedProps} />
						)}
					</div>
				</GradientBorder>

				<div className="ml-4 mt-2 flex items-start justify-between px-1">
					<div>
						{field.subtext && !errors[field.name] && (
							<p className="text-sm font-medium text-white/30">{field.subtext}</p>
						)}
						{errors[field.name] && <p className={errorClass}>{errors[field.name]}</p>}
					</div>
				</div>
			</div>
		);
	};

	return (
		<GradientBorder thickness={2} radius="40px">
			<div
				className="pointer-events-none absolute inset-0 rounded-[25px]"
				style={{
					background: `linear-gradient(120deg, rgba(255, 255, 255, 0.75) 0%, transparent 8%, transparent 92%, rgba(255, 255, 255, 0.75) 100%)`,
				}}
			/>

			<form
				className="relative space-y-6 p-5 md:p-8"
				style={{ borderRadius: '38px' }}
				onSubmit={handleSubmit}
			>
				<div className="relative z-10 grid grid-cols-1 gap-5 text-left md:grid-cols-2 md:gap-6">
					{fields.map(renderField)}
				</div>

				{onSubmit && (
					<div className="relative z-10 flex gap-4 pt-1">
						<button
							type="submit"
							disabled={loading}
							className="flex-[4] rounded-2xl bg-[#606bfa] py-3.5 text-lg font-semibold text-white transition-all hover:bg-[#6f79ff] disabled:opacity-50"
						>
							{loading ? loadingLabel : submitLabel}
						</button>

						{clearable && (
							<button
								type="button"
								onClick={handleClear}
								disabled={loading}
								className="min-w-[120px] flex-1 rounded-2xl border border-white py-3.5 text-lg font-semibold text-white transition-all hover:bg-white/10 disabled:opacity-50"
							>
								Clear Form
							</button>
						)}
					</div>
				)}
			</form>
		</GradientBorder>
	);
}
