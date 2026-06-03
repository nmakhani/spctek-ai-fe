'use client';

import { type ReactNode } from 'react';
import Image from 'next/image';

type PortalTableCellType = 'text' | 'number' | 'date' | 'image' | 'custom';
type PortalTableActionVariant = 'primary' | 'danger' | 'success' | 'secondary';

export interface PortalTableColumn<T> {
	header: string;
	type?: PortalTableCellType;
	accessor?: keyof T | ((row: T) => ReactNode);
	render?: (row: T) => ReactNode;
	className?: string;
	fallback?: ReactNode;
	dateFormat?: Intl.DateTimeFormatOptions;
	image?: {
		alt?: string | ((row: T) => string);
		width?: number;
		height?: number;
		className?: string;
	};
}

export interface PortalTableAction<T> {
	label: string;
	onClick: (row: T) => void;
	disabled?: boolean;
	loading?: boolean;
	loadingLabel?: string;
	variant?: PortalTableActionVariant;
}

interface PortalTableProps<T> {
	columns: Array<string | PortalTableColumn<T>>;
	children?: ReactNode;
	loading: boolean;
	loadingMessage: string;
	empty: boolean;
	emptyMessage: string;
	className?: string;
	minWidthClassName?: string;
	data?: T[];
	getRowKey?: (row: T) => string;
	rowClassName?: string | ((row: T) => string);
	actions?: (row: T) => PortalTableAction<T>[];
	actionsHeader?: string;
}

const rowBaseClass = 'border-b border-white/10 transition hover:bg-white/[0.05]';

const actionClassNames: Record<PortalTableActionVariant, string> = {
	primary: 'bg-[#606bfa] text-white hover:bg-[#6f79ff] disabled:opacity-60',
	danger:
		'bg-[#ef4444] text-white hover:bg-[#ff5a5a] hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] disabled:cursor-not-allowed disabled:opacity-50',
	success: 'bg-[#10b981] text-white hover:bg-[#34d399] disabled:opacity-60',
	secondary:
		'border border-white/20 bg-white/[0.08] text-white/80 hover:bg-white/[0.14] disabled:opacity-60',
};

function getColumnValue<T>(column: PortalTableColumn<T>, row: T) {
	if (column.render) {
		return column.render(row);
	}

	if (typeof column.accessor === 'function') {
		return column.accessor(row);
	}

	if (column.accessor) {
		return row[column.accessor] as ReactNode;
	}

	return null;
}

function getCellClassName<T>(column: PortalTableColumn<T>) {
	const toneByType: Record<PortalTableCellType, string> = {
		text: 'text-white/75',
		number: 'text-white/75',
		date: 'text-white/65',
		image: '',
		custom: 'text-white',
	};

	return `px-6 py-3 ${toneByType[column.type || 'text']} ${column.className || ''}`.trim();
}

function renderCellValue<T>(column: PortalTableColumn<T>, row: T) {
	const value = getColumnValue(column, row);
	const fallback = column.fallback ?? '-';

	if (value === null || value === undefined || value === '') {
		return fallback;
	}

	if (column.type === 'date') {
		const date = new Date(String(value));
		return Number.isNaN(date.getTime()) ? fallback : date.toLocaleDateString(undefined, column.dateFormat);
	}

	if (column.type === 'image') {
		if (typeof value !== 'string') {
			return fallback;
		}

		const alt =
			typeof column.image?.alt === 'function' ? column.image.alt(row) : column.image?.alt || '';

		return (
			<Image
				src={value}
				alt={alt}
				width={column.image?.width || 64}
				height={column.image?.height || 48}
				className={column.image?.className || 'h-12 w-16 rounded-lg object-cover'}
			/>
		);
	}

	return value;
}

function renderActions<T>(row: T, actions: PortalTableAction<T>[]) {
	return (
		<div className="flex gap-2">
			{actions.map((action) => (
				<button
					key={action.label}
					type="button"
					onClick={() => action.onClick(row)}
					disabled={action.disabled || action.loading}
					className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${actionClassNames[action.variant || 'primary']}`}
				>
					{action.loading ? action.loadingLabel || action.label : action.label}
				</button>
			))}
		</div>
	);
}

export function PortalTable<T>({
	columns,
	children,
	loading,
	loadingMessage,
	empty,
	emptyMessage,
	className = '',
	minWidthClassName = '',
	data,
	getRowKey,
	rowClassName,
	actions,
	actionsHeader = 'Actions',
}: PortalTableProps<T>) {
	if (loading) {
		return <div className="py-12 text-center text-white/55">{loadingMessage}</div>;
	}

	if (empty) {
		return <div className="py-12 text-center text-white/55">{emptyMessage}</div>;
	}

	return (
		<div
			className={`overflow-x-auto rounded-3xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_44%,rgba(96,107,250,0.12)_100%)] shadow-[0_20px_50px_rgba(0,0,0,0.58)] backdrop-blur-xl ${className}`}
		>
			<table className={`w-full ${minWidthClassName}`}>
				<thead className="border-b border-white/10 bg-black/25">
					<tr>
						{columns.map((column) => (
							<th
								key={typeof column === 'string' ? column : column.header}
								className="px-6 py-3 text-left font-semibold text-white/75"
							>
								{typeof column === 'string' ? column : column.header}
							</th>
						))}
						{actions && <th className="px-6 py-3 text-left font-semibold text-white/75">{actionsHeader}</th>}
					</tr>
				</thead>
				<tbody>
					{data && getRowKey
						? data.map((row) => {
								const resolvedRowClassName =
									typeof rowClassName === 'function' ? rowClassName(row) : rowClassName || rowBaseClass;
								const rowActions = actions?.(row) || [];

								return (
									<tr key={getRowKey(row)} className={resolvedRowClassName}>
										{(columns as PortalTableColumn<T>[]).map((column) => (
											<td key={column.header} className={getCellClassName(column)}>
												{renderCellValue(column, row)}
											</td>
										))}
										{actions && <td className="px-6 py-3">{renderActions(row, rowActions)}</td>}
									</tr>
								);
							})
						: children}
				</tbody>
			</table>
		</div>
	);
}
