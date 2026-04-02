"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { contactsApi } from "@/lib/api";
import toast from "react-hot-toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { ProtectedRoute } from "@/components/ProtectedRoute";

interface Contact {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  source?: string;
  created_at?: string;
}

function getErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

function ContactsContent() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    source: "landing_page",
  });

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactsApi.list();
      setContacts(response.data);
      setError("");
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to load contacts");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      if (editingId) {
        const response = await contactsApi.update(editingId, formData);
        const updated = response.data as Contact;
        setContacts((prev) =>
          prev.map((contact) => (contact.id === editingId ? updated : contact)),
        );
        toast.success("Contact updated");
      } else {
        const response = await contactsApi.create(formData);
        const created = response.data as Contact;
        setContacts((prev) => [created, ...prev]);
        toast.success("Contact created");
      }
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
        source: "landing_page",
      });
      setEditingId(null);
      setShowForm(false);
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to save contact");
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // Handle edit
  const handleEdit = (contact: Contact) => {
    setFormData({
      name: contact.name || "",
      email: contact.email || "",
      phone: contact.phone || "",
      company: contact.company || "",
      message: contact.message || "",
      source: contact.source || "landing_page",
    });
    setEditingId(contact.id);
    setShowForm(true);
  };

  // Handle delete
  const requestDelete = (id: string) => {
    setPendingDeleteId(id);
  };

  const handleDelete = async () => {
    if (!pendingDeleteId) {
      return;
    }

    try {
      setDeletingId(pendingDeleteId);
      setError("");
      await contactsApi.delete(pendingDeleteId);
      setContacts((prev) =>
        prev.filter((contact) => contact.id !== pendingDeleteId),
      );
      toast.success("Contact deleted");
      setPendingDeleteId(null);
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to delete contact");
      setError(message);
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
      source: "landing_page",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const cancelDelete = () => {
    if (deletingId) {
      return;
    }
    setPendingDeleteId(null);
  };

  return (
    <div className="min-h-screen page-fade">
      <ConfirmDialog
        isOpen={Boolean(pendingDeleteId)}
        title="Delete contact"
        message="This action cannot be undone. Are you sure you want to continue?"
        confirmLabel="Delete"
        loading={Boolean(deletingId)}
        onConfirm={handleDelete}
        onCancel={cancelDelete}
      />

      <header className="sticky top-0 z-10 backdrop-blur-md bg-slate-950/45 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center gap-4">
          <div>
            <Link
              href="/portal"
              className="text-dark-400 hover:text-sky-300 transition mb-2 inline-block"
            >
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-dark-50">
              Contacts Dashboard
            </h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-5 py-2.5 rounded-xl transition"
          >
            {showForm ? "Cancel" : "+ New Contact"}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {error && (
          <div className="glass rounded-2xl border-red-700/50 text-red-200 px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {showForm && (
          <div className="glass rounded-3xl p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold text-dark-50 mb-4">
              {editingId ? "Edit Contact" : "New Contact"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-dark-300 text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full glass-soft rounded-xl px-4 py-2.5 text-dark-50 ring-focus"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-dark-300 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full glass-soft rounded-xl px-4 py-2.5 text-dark-50 ring-focus"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-dark-300 text-sm font-medium mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full glass-soft rounded-xl px-4 py-2.5 text-dark-50 ring-focus"
                  placeholder="+1 555 123 4567"
                />
              </div>

              <div>
                <label className="block text-dark-300 text-sm font-medium mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full glass-soft rounded-xl px-4 py-2.5 text-dark-50 ring-focus"
                  placeholder="Acme Inc."
                />
              </div>

              <div>
                <label className="block text-dark-300 text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full glass-soft rounded-xl px-4 py-2.5 text-dark-50 ring-focus h-28"
                  placeholder="Message details"
                />
              </div>

              <div>
                <label className="block text-dark-300 text-sm font-medium mb-2">
                  Source
                </label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) =>
                    setFormData({ ...formData, source: e.target.value })
                  }
                  className="w-full glass-soft rounded-xl px-4 py-2.5 text-dark-50 ring-focus"
                  placeholder="landing_page"
                />
              </div>

              <p className="text-xs text-dark-400">
                Note: backend requires at least one of Email or Phone.
              </p>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-4 py-2 rounded-xl transition"
                >
                  {saving ? "Saving..." : editingId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="glass-soft hover:bg-slate-700/60 text-dark-100 px-4 py-2 rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-dark-400">
            Loading contacts...
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-12 text-dark-400">No contacts yet</div>
        ) : (
          <div className="overflow-x-auto glass rounded-3xl">
            <table className="w-full">
              <thead className="bg-slate-800/40 border-b border-white/10">
                <tr>
                  <th className="px-6 py-3 text-left text-dark-300 font-semibold">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-dark-300 font-semibold">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-dark-300 font-semibold">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-dark-300 font-semibold">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-dark-300 font-semibold">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-dark-300 font-semibold">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-dark-300 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="border-b border-white/10 hover:bg-slate-700/25 transition"
                  >
                    <td className="px-6 py-3 text-dark-50">
                      {contact.name || "—"}
                    </td>
                    <td className="px-6 py-3 text-dark-300">
                      {contact.email || "—"}
                    </td>
                    <td className="px-6 py-3 text-dark-400">
                      {contact.phone || "—"}
                    </td>
                    <td className="px-6 py-3 text-dark-400">
                      {contact.company || "—"}
                    </td>
                    <td className="px-6 py-3 text-dark-400">
                      {contact.source || "—"}
                    </td>
                    <td className="px-6 py-3 text-dark-400">
                      {contact.created_at
                        ? new Date(contact.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(contact)}
                          disabled={deletingId === contact.id}
                          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium px-3 py-1.5 rounded-lg text-sm transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => requestDelete(contact.id)}
                          disabled={deletingId === contact.id}
                          className="bg-rose-500 hover:bg-rose-400 text-slate-950 font-medium px-3 py-1.5 rounded-lg text-sm transition"
                        >
                          {deletingId === contact.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ContactsPage() {
  return (
    <ProtectedRoute>
      <ContactsContent />
    </ProtectedRoute>
  );
}
