'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface StatusOption {
	id: string;
	code: string;
	contact_count: number;
}

interface StatusManagementModalProps {
	isOpen: boolean;
	statuses: StatusOption[];
	loading: boolean;
	savingId: string | null;
	deletingId: string | null;
	onClose: () => void;
	onCreate: (code: string) => Promise<void>;
	onUpdate: (id: string, code: string) => Promise<void>;
	onDelete: (id: string) => Promise<void>;
}

export function StatusManagementModal({
	isOpen,
	statuses,
	loading,
	savingId,
	deletingId,
	onClose,
	onCreate,
	onUpdate,
	onDelete,
}: StatusManagementModalProps) {
	const modalRef = useRef<HTMLDivElement>(null);
	const [newCode, setNewCode] = useState('');
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingCode, setEditingCode] = useState('');

	const resetLocalState = useCallback(() => {
		setNewCode('');
		setEditingId(null);
		setEditingCode('');
	}, []);

	const handleClose = useCallback(() => {
		resetLocalState();
		onClose();
	}, [onClose, resetLocalState]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
				handleClose();
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			document.body.style.overflow = 'hidden';
			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
				document.body.style.overflow = '';
			};
		}
	}, [isOpen, handleClose]);

	if (!isOpen) {
		return null;
	}

	const busy = Boolean(savingId || deletingId);

	const contactCountLabel = (count?: number) => {
		const safeCount = count ?? 0;
		return `${safeCount} contact${safeCount === 1 ? '' : 's'}`;
	};

	const handleCreate = async (event: React.FormEvent) => {
		event.preventDefault();
		const code = newCode.trim();
		if (!code) {
			return;
		}
		await onCreate(code);
		setNewCode('');
	};

	const handleUpdate = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!editingId) {
			return;
		}
		const code = editingCode.trim();
		if (!code) {
			return;
		}
		await onUpdate(editingId, code);
		setEditingId(null);
		setEditingCode('');
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 pt-24 backdrop-blur-sm">
			<div
				ref={modalRef}
				className="flex max-h-[78vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_46%,rgba(96,107,250,0.12)_100%)] shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl"
			>
				<div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-black/25 px-6 py-4">
					<h3 className="text-lg font-semibold text-white">Manage Statuses</h3>
					<button
						type="button"
						onClick={handleClose}
						disabled={busy}
						className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/20 disabled:opacity-60"
					>
						Close
					</button>
				</div>

				<div className="space-y-5 overflow-y-auto p-6">
					<form onSubmit={handleCreate} className="flex flex-col gap-3 sm:flex-row">
						<input
							type="text"
							value={newCode}
							maxLength={50}
							onChange={(event) => setNewCode(event.target.value)}
							className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
							placeholder="New status code"
						/>
						<button
							type="submit"
							disabled={busy || !newCode.trim()}
							className="rounded-xl bg-[#606bfa] px-4 py-2 font-semibold text-white transition hover:bg-[#6f79ff] disabled:cursor-not-allowed disabled:opacity-60"
						>
							{savingId === 'new' ? 'Adding...' : 'Add Status'}
						</button>
					</form>

					<div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
						{loading ? (
							<div className="px-4 py-8 text-center text-white/55">Loading statuses...</div>
						) : statuses.length === 0 ? (
							<div className="px-4 py-8 text-center text-white/55">No statuses found</div>
						) : (
							<div className="divide-y divide-white/10">
								{statuses.map((status) => {
									const isEditing = editingId === status.id;

									return (
										<div key={status.id} className="px-4 py-3">
											{isEditing ? (
												<form onSubmit={handleUpdate} className="flex flex-col gap-3 sm:flex-row">
													<input
														type="text"
														value={editingCode}
														maxLength={50}
														onChange={(event) => setEditingCode(event.target.value)}
														className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
													/>
													<div className="flex gap-2">
														<button
															type="submit"
															disabled={busy || !editingCode.trim()}
															className="rounded-lg bg-[#606bfa] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#6f79ff] disabled:opacity-60"
														>
															{savingId === status.id ? 'Saving...' : 'Save'}
														</button>
														<button
															type="button"
															onClick={() => {
																setEditingId(null);
																setEditingCode('');
															}}
															disabled={busy}
															className="rounded-lg border border-white/15 bg-white/[0.06] px-3 py-1.5 text-sm font-medium text-white/80 transition hover:bg-white/[0.12] disabled:opacity-60"
														>
															Cancel
														</button>
													</div>
												</form>
											) : (
												<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
													<div className="flex flex-wrap items-center gap-2">
														<span className="font-medium text-white">{status.code}</span>
														<span className="rounded-full border border-white/15 bg-white/[0.08] px-2.5 py-1 text-xs font-medium text-white/65">
															{contactCountLabel(status.contact_count)}
														</span>
													</div>
													<div className="flex gap-2">
														<button
															type="button"
															onClick={() => {
																setEditingId(status.id);
																setEditingCode(status.code);
															}}
															disabled={busy}
															className="rounded-lg bg-[#606bfa] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#6f79ff] disabled:opacity-60"
														>
															Edit
														</button>
														<button
															type="button"
															onClick={() => onDelete(status.id)}
															disabled={busy}
															className="rounded-lg bg-[#ef4444] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#ff5a5a] disabled:cursor-not-allowed disabled:opacity-50"
														>
															{deletingId === status.id ? 'Deleting...' : 'Delete'}
														</button>
													</div>
												</div>
											)}
										</div>
									);
								})}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
