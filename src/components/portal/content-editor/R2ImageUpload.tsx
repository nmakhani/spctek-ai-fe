'use client';

import { useEffect, useRef, useState } from 'react';

import { resolveR2PublicUrl } from '@/lib/r2';

interface R2ImageUploadProps {
	label: string;
	value: string;
	onChange: (value: string, file?: File | null) => void;
	hint?: string;
}

export function R2ImageUpload({ label, value, onChange, hint }: R2ImageUploadProps) {
	const objectUrlRef = useRef<string | null>(null);
	const [error, setError] = useState('');

	useEffect(() => {
		if (objectUrlRef.current && objectUrlRef.current !== value) {
			URL.revokeObjectURL(objectUrlRef.current);
			objectUrlRef.current = null;
		}
	}, [value]);

	useEffect(() => {
		return () => {
			if (objectUrlRef.current) {
				URL.revokeObjectURL(objectUrlRef.current);
			}
		};
	}, []);

	const handleFileChange = (file: File | null) => {
		setError('');

		if (!file) {
			onChange('', null);
			return;
		}

		const localPreviewUrl = URL.createObjectURL(file);
		objectUrlRef.current = localPreviewUrl;

		onChange(localPreviewUrl, file);
	};

	const previewUrl = value ? resolveR2PublicUrl(value) : '';

	return (
		<div>
			<label className="mb-2 block text-sm font-medium text-white/75">{label}</label>
			<input
				type="file"
				accept="image/*"
				onChange={(e) => void handleFileChange(e.target.files?.[0] || null)}
				className="block w-full text-sm text-white/80 file:mr-4 file:rounded-lg file:border-0 file:bg-[#606bfa] file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-[#6f79ff] disabled:opacity-60"
			/>
			<p className="mt-2 text-xs text-white/45">
				{hint || 'Select an image. It will be uploaded straight to R2 when you click Save.'}
			</p>
			{error && <p className="text-red-300 mt-2 text-xs">{error}</p>}
			{previewUrl && (
				<>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={previewUrl}
						alt="Upload preview"
						className="mt-3 h-40 w-full rounded-lg border border-white/15 object-cover"
					/>
				</>
			)}
		</div>
	);
}
