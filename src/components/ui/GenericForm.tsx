'use client';

import React, { useState } from 'react';

import { DarkDropdown } from './form-parts/DarkDropdown';
import { GlassGlow } from './GlassGlow';
import { GradientBorder } from './GradientBorder';

export type FieldType = 'text' | 'email' | 'tel' | 'textarea' | 'action' | 'date' | 'select';

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
	options?: string[];
	menuMaxHeightClass?: string;
}

export interface FormValues {
	[key: string]: string;
}

export interface FormErrors {
	[key: string]: string | undefined;
	submit?: string;
}

export type ValidateFn = (values: FormValues) => FormErrors;

export interface SubmitAction {
	label: string;
	value: string;
}

interface GenericFormProps {
	fields: FieldConfig[];
	initialValues?: FormValues;
	validate?: ValidateFn;
	onSubmit?: (values: FormValues, action?: string) => Promise<void>;
	clearable?: boolean;
	submitLabel?: string;
	loadingLabel?: string;
	submitActions?: SubmitAction[];
	skipValidationForActions?: string[];
	compact?: boolean;
}

const labelClass = 'mb-2 block text-white text-lg font-semibold md:text-2xl';
const compactLabelClass = 'mb-2 block text-white text-sm font-semibold sm:text-base';
const errorClass = 'mt-1 text-sm text-red-400';

const inputInnerClass =
	'w-full glow-input bg-transparent px-5 py-4 text-base text-white/90 placeholder:text-white/25 outline-none focus:ring-0 transition-all resize-none';
const compactInputInnerClass =
	'w-full glow-input bg-transparent px-4 py-3 text-sm text-white/90 placeholder:text-white/25 outline-none focus:ring-0 transition-all resize-none sm:text-base';

export default function GenericForm({
	fields,
	initialValues,
	validate,
	onSubmit,
	clearable = false,
	submitLabel = 'Submit',
	loadingLabel = 'Submitting...',
	submitActions,
	skipValidationForActions = [],
	compact = false,
}: GenericFormProps) {
	const defaultValues = fields.reduce<FormValues>((acc, f) => {
		acc[f.name] = initialValues?.[f.name] ?? '';
		return acc;
	}, {});

	const [values, setValues] = useState<FormValues>(defaultValues);
	const [errors, setErrors] = useState<FormErrors>({});
	const [loading, setLoading] = useState(false);

	const handleChange = (name: string, value: string) => setValues((prev) => ({ ...prev, [name]: value }));

	const handleClear = () => {
		setValues(defaultValues);
		setErrors({});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
		const action = submitter?.value;
		const skipValidation = Boolean(action && skipValidationForActions.includes(action));

		const validationErrors = skipValidation ? {} : validate?.(values) || {};
		setErrors(validationErrors);

		if (Object.keys(validationErrors).length > 0) return;

		try {
			setLoading(true);
			setErrors({});
			if (onSubmit) {
				await onSubmit(values, action);
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
			<div key={field.name} className={`${spanClass} relative`}>
				<label className={compact ? compactLabelClass : labelClass}>
					{field.label} {field.required && <span className="text-red-400">*</span>}
				</label>

				<div className={field.type === 'select' ? 'relative' : 'relative z-10'}>
					{field.type === 'select' ? (
						<DarkDropdown
							value={values[field.name]}
							options={field.options || []}
							placeholder={field.placeholder}
							onChange={(value) => handleChange(field.name, value)}
							compact={compact}
							menuMaxHeightClass={field.menuMaxHeightClass}
						/>
					) : (
						<>
							<GradientBorder thickness={1} radius="16px" subtle={true} hasError={hasError} />
							<GlassGlow angle={105} opacity={0.5} start={5} end={95} radius="16px" />

							<div style={{ overflow: 'hidden' }}>
								{field.type === 'action' ? (
									<button
										type="button"
										disabled={loading}
										onClick={field.onAction}
										className={`flex w-full items-center justify-between font-medium transition-all hover:bg-white/5 active:bg-white/10 ${
											compact ? 'px-4 py-3 text-base' : 'px-5 py-4 text-lg'
										}`}
									>
										<span className="text-white/60">{field.placeholder}</span>
										<span className="text-white/30">{field.actionLabel}</span>
									</button>
								) : field.type === 'textarea' ? (
									<textarea
										rows={field.rows ?? 4}
										className={compact ? compactInputInnerClass : inputInnerClass}
										{...sharedProps}
									/>
								) : (
									<input
										type={field.type}
										className={compact ? compactInputInnerClass : inputInnerClass}
										{...sharedProps}
									/>
								)}
							</div>
						</>
					)}
				</div>

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
		<div className="relative z-10">
			<GradientBorder thickness={compact ? 1 : 2} radius={compact ? '24px' : '40px'} />
			<GlassGlow angle={120} opacity={0.5} start={10} end={90} radius={compact ? '24px' : '40px'} />

			<form
				className={compact ? 'relative space-y-4 p-4 sm:p-5' : 'relative space-y-6 p-5 md:p-8'}
				style={{ borderRadius: compact ? '22px' : '38px' }}
				onSubmit={handleSubmit}
			>
				<div
					className={`relative z-10 grid grid-cols-1 text-left md:grid-cols-2 ${compact ? 'gap-4' : 'gap-5 md:gap-6'}`}
				>
					{fields.map(renderField)}
				</div>

				{onSubmit && (
					<div className="relative z-10 flex flex-col gap-3 pt-1 sm:flex-row">
						{submitActions?.length ? (
							submitActions.map((action, index) => {
								const isPrimary = index === 0;

								return (
									<button
										key={action.value}
										type="submit"
										value={action.value}
										disabled={loading}
										className={`flex-1 rounded-2xl font-semibold transition-all disabled:opacity-50 ${
											isPrimary
												? 'bg-[#606bfa] text-white hover:bg-[#6f79ff]'
												: 'border border-white/20 bg-white/[0.08] text-white hover:bg-white/[0.12]'
										} ${compact ? 'px-4 py-3 text-base' : 'px-5 py-3.5 text-lg'}`}
									>
										{loading ? loadingLabel : action.label}
									</button>
								);
							})
						) : (
							<button
								type="submit"
								disabled={loading}
								className={`flex-[4] rounded-2xl bg-[#606bfa] font-semibold text-white transition-all hover:bg-[#6f79ff] disabled:opacity-50 ${
									compact ? 'py-3 text-base' : 'py-3.5 text-lg'
								}`}
							>
								{loading ? loadingLabel : submitLabel}
							</button>
						)}

						{clearable && (
							<button
								type="button"
								onClick={handleClear}
								disabled={loading}
								className={`min-w-[120px] rounded-2xl border border-white font-semibold text-white transition-all hover:bg-white/10 disabled:opacity-50 sm:flex-1 ${
									compact ? 'py-3 text-base' : 'py-3.5 text-lg'
								}`}
							>
								Clear Form
							</button>
						)}
					</div>
				)}
			</form>
		</div>
	);
}
