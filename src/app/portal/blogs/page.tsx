"use client";

import { useEffect, useState } from "react";
import { blogsApi } from "@/lib/api";
import toast from "react-hot-toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageHeader } from "@/components/portal/PageHeader";
import { StatCard } from "@/components/portal/StatCard";

interface Blog {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  author?: string;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

function getErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

function BlogsContent() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    author: "",
    is_published: false,
  });

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogsApi.list();
      setBlogs(response.data);
      setError("");
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to load blogs");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      if (editingId) {
        const response = await blogsApi.update(editingId, formData);
        const updated = response.data as Blog;
        setBlogs((prev) =>
          prev.map((blog) => (blog.id === editingId ? updated : blog)),
        );
        toast.success("Blog updated");
      } else {
        const response = await blogsApi.create(formData);
        const created = response.data as Blog;
        setBlogs((prev) => [created, ...prev]);
        toast.success("Blog created");
      }
      setFormData({
        title: "",
        slug: "",
        summary: "",
        content: "",
        author: "",
        is_published: false,
      });
      setEditingId(null);
      setShowForm(false);
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to save blog");
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // Handle edit
  const handleEdit = (blog: Blog) => {
    setFormData({
      title: blog.title,
      slug: blog.slug,
      summary: blog.summary || "",
      content: blog.content,
      author: blog.author || "",
      is_published: blog.is_published,
    });
    setEditingId(blog.id);
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
      await blogsApi.delete(pendingDeleteId);
      setBlogs((prev) => prev.filter((blog) => blog.id !== pendingDeleteId));
      toast.success("Blog deleted");
      setPendingDeleteId(null);
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to delete blog");
      setError(message);
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({
      title: "",
      slug: "",
      summary: "",
      content: "",
      author: "",
      is_published: false,
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
    <div className="min-h-screen animate-[pageFade_450ms_ease] pb-12">
      <ConfirmDialog
        isOpen={Boolean(pendingDeleteId)}
        title="Delete blog"
        message="This action cannot be undone. Are you sure you want to continue?"
        confirmLabel="Delete"
        loading={Boolean(deletingId)}
        onConfirm={handleDelete}
        onCancel={cancelDelete}
      />

      <PageHeader
        title="Blogs"
        subtitle="Dashboard"
        backLink="/portal"
        backText="← Back to Home"
        buttonText="+ New Blog"
        buttonOnClick={() => setShowForm(!showForm)}
        showForm={showForm}
      />

      <main className="mx-auto max-w-7xl py-10 px-6">
        <StatCard label="Total Blogs" loading={loading} count={blogs.length} />

        {error && (
          <div className="mb-6 rounded-2xl border border-red-300/35 bg-red-500/18 px-4 py-3 text-red-200">
            {error}
          </div>
        )}

        {showForm && (
          <div className="mb-8 overflow-hidden rounded-3xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_46%,rgba(96,107,250,0.12)_100%)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl md:p-8">
            <h2 className="mb-4 text-xl font-semibold text-white">
              {editingId ? "Edit Blog" : "New Blog"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
                  placeholder="Blog title"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/75">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
                    placeholder="fastapi-best-practices"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/75">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
                    placeholder="Author name"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Summary
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  className="h-24 w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
                  placeholder="Short summary used in listings"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Content *
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="h-48 w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
                  placeholder="Blog content"
                />
              </div>

              <label className="flex items-center gap-3 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) =>
                    setFormData({ ...formData, is_published: e.target.checked })
                  }
                  className="h-4 w-4 accent-[#606bfa]"
                />
                Mark as published
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#606bfa] px-4 py-2 font-semibold text-white transition hover:bg-[#6f79ff] disabled:opacity-60"
                >
                  {saving ? "Saving..." : editingId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="rounded-xl border border-white/20 bg-white/[0.08] px-4 py-2 text-white/85 transition hover:bg-white/[0.14] disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-white/55">
            Loading blogs...
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-12 text-center text-white/55">No blogs yet</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="overflow-hidden rounded-3xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_44%,rgba(96,107,250,0.12)_100%)] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:border-[#7d89ff]/60"
              >
                <h3 className="mb-2 line-clamp-2 text-xl font-semibold text-white">
                  {blog.title}
                </h3>
                <p className="mb-2 text-xs text-[#a9b2ff]">/{blog.slug}</p>
                {blog.author && (
                  <p className="mb-3 text-sm text-white/60">By {blog.author}</p>
                )}
                {blog.summary && (
                  <p className="mb-3 line-clamp-2 text-sm text-white/78">
                    {blog.summary}
                  </p>
                )}
                <p className="mb-4 line-clamp-3 text-sm text-white/65">
                  {blog.content}
                </p>
                <div className="mb-4 flex items-center justify-between text-xs">
                  <span
                    className={`px-2.5 py-1 rounded-full border ${
                      blog.is_published
                        ? "text-emerald-300 border-emerald-400/40 bg-emerald-400/10"
                        : "text-amber-300 border-amber-400/40 bg-amber-400/10"
                    }`}
                  >
                    {blog.is_published ? "Published" : "Draft"}
                  </span>
                  {blog.created_at && (
                    <span className="text-white/60">
                      Created {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(blog)}
                    disabled={deletingId === blog.id}
                    className="flex-1 rounded-lg bg-[#606bfa] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#6f79ff] disabled:opacity-60"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => requestDelete(blog.id)}
                    disabled={deletingId === blog.id}
                    className="flex-1 rounded-lg bg-[#ef4444] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#ff5a5a] disabled:opacity-60"
                  >
                    {deletingId === blog.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function BlogsPage() {
  return (
    <ProtectedRoute>
      <BlogsContent />
    </ProtectedRoute>
  );
}
