import { DarkDropdown } from '@/components/ui/form-parts/DarkDropdown';
import type { Contact } from './types';
import { getContactOption } from './utils';

interface ReinstatementContactFilterProps {
	contacts: Contact[];
	selectedContact: Contact | undefined;
	onChange: (option: string) => void;
}

export function ReinstatementContactFilter({ contacts, selectedContact, onChange }: ReinstatementContactFilterProps) {
	const contactOptions = contacts.map(getContactOption);
	const selectedContactOption = selectedContact ? getContactOption(selectedContact) : '';

	return (
		<>
			<div className="mb-8">
				<label className="mb-3 block text-sm font-medium text-white/75">Filter by Contact</label>
				<DarkDropdown
					value={selectedContactOption}
					options={contactOptions}
					placeholder="Select a contact..."
					onChange={onChange}
				/>
			</div>

			{selectedContact && (
				<div className="mb-6 rounded-2xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_46%,rgba(96,107,250,0.12)_100%)] p-6 backdrop-blur-xl">
					<h3 className="font-semibold text-white">Selected Contact</h3>
					<p className="mt-2 text-sm text-white/75">
						{selectedContact.name && <span className="font-medium text-white">{selectedContact.name}</span>}
						{selectedContact.name && selectedContact.email && <span> - </span>}
						{selectedContact.email && <span>{selectedContact.email}</span>}
					</p>
					{selectedContact.phone && <p className="text-sm text-white/65">Phone: {selectedContact.phone}</p>}
				</div>
			)}
		</>
	);
}
