import type { Category } from '@/components/portal/content-editor/types';
import { PortalTable, type PortalTableAction, type PortalTableColumn } from '@/components/portal/PortalTable';
import type { CategoryUsageCountMap } from './types';

interface CategoriesTableProps {
	categories: Category[];
	usageCounts: CategoryUsageCountMap;
	loading: boolean;
	editingCategoryId: string | null;
	editingCategoryName: string;
	actionLoadingId: string | null;
	onEditingNameChange: (name: string) => void;
	onEdit: (category: Category) => void;
	onCancelEdit: () => void;
	onSaveEdit: () => void | Promise<void>;
	onRequestDelete: (categoryId: string) => void;
}

export function CategoriesTable({
	categories,
	usageCounts,
	loading,
	editingCategoryId,
	editingCategoryName,
	actionLoadingId,
	onEditingNameChange,
	onEdit,
	onCancelEdit,
	onSaveEdit,
	onRequestDelete,
}: CategoriesTableProps) {
	const categoryColumns: PortalTableColumn<Category>[] = [
		{
			header: 'Category',
			type: 'custom',
			render: (category) =>
				editingCategoryId === category.id ? (
					<input
						type="text"
						value={editingCategoryName}
						onChange={(event) => onEditingNameChange(event.target.value)}
						className="w-full min-w-44 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2 text-sm text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
					/>
				) : (
					<span className="font-medium">{category.name}</span>
				),
		},
		{ header: 'Slug', accessor: 'slug', className: 'text-white/60' },
		{
			header: 'Blogs',
			type: 'number',
			accessor: (category) => usageCounts[category.id]?.blogs ?? 0,
		},
		{
			header: 'Case Studies',
			type: 'number',
			accessor: (category) => usageCounts[category.id]?.caseStudies ?? 0,
		},
		{
			header: 'Workflows',
			type: 'number',
			accessor: (category) => usageCounts[category.id]?.workflows ?? 0,
		},
	];

	const getCategoryActions = (category: Category): PortalTableAction<Category>[] => {
		const isEditing = editingCategoryId === category.id;
		const isWorking = actionLoadingId === category.id;

		if (isEditing) {
			return [
				{
					label: 'Save',
					loadingLabel: 'Saving...',
					loading: isWorking,
					variant: 'success',
					onClick: onSaveEdit,
				},
				{
					label: 'Cancel',
					disabled: isWorking,
					variant: 'secondary',
					onClick: onCancelEdit,
				},
			];
		}

		return [
			{
				label: 'Edit',
				disabled: isWorking,
				onClick: onEdit,
			},
			{
				label: 'Delete',
				disabled: isWorking,
				variant: 'danger',
				onClick: (selectedCategory) => onRequestDelete(selectedCategory.id),
			},
		];
	};

	return (
		<PortalTable
			columns={categoryColumns}
			loading={loading}
			loadingMessage="Loading categories..."
			empty={categories.length === 0}
			emptyMessage="No categories yet"
			minWidthClassName="min-w-[820px]"
			data={categories}
			getRowKey={(category) => category.id}
			actions={getCategoryActions}
		/>
	);
}
