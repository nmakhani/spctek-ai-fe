"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { blogsApi } from "@/lib/api";
import toast from "react-hot-toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { ProtectedRoute } from "@/components/ProtectedRoute";

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
    <div className="min-h-screen page-fade">
      <ConfirmDialog
        isOpen={Boolean(pendingDeleteId)}
        title="Delete blog"
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
              className="text-dark-400 hover:text-cyan-300 transition mb-2 inline-block"
            >
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-dark-50">Blogs Dashboard</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-5 py-2.5 rounded-xl transition"
          >
            {showForm ? "Cancel" : "+ New Blog"}
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
              {editingId ? "Edit Blog" : "New Blog"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-dark-300 text-sm font-medium mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full glass-soft rounded-xl px-4 py-2.5 text-dark-50 ring-focus"
                  placeholder="Blog title"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-dark-300 text-sm font-medium mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="w-full glass-soft rounded-xl px-4 py-2.5 text-dark-50 ring-focus"
                    placeholder="fastapi-best-practices"
                  />
                </div>

                <div>
                  <label className="block text-dark-300 text-sm font-medium mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    className="w-full glass-soft rounded-xl px-4 py-2.5 text-dark-50 ring-focus"
                    placeholder="Author name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-dark-300 text-sm font-medium mb-2">
                  Summary
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  className="w-full glass-soft rounded-xl px-4 py-2.5 text-dark-50 ring-focus h-24"
                  placeholder="Short summary used in listings"
                />
              </div>

              <div>
                <label className="block text-dark-300 text-sm font-medium mb-2">
                  Content *
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full glass-soft rounded-xl px-4 py-2.5 text-dark-50 ring-focus h-48"
                  placeholder="Blog content"
                />
              </div>

              <label className="flex items-center gap-3 text-dark-200 text-sm">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) =>
                    setFormData({ ...formData, is_published: e.target.checked })
                  }
                  className="h-4 w-4 accent-cyan-400"
                />
                Mark as published
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-4 py-2 rounded-xl transition"
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
            Loading blogs...
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12 text-dark-400">No blogs yet</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((blog) => (
              <div key={blog.id} className="glass glass-hover rounded-3xl p-6">
                <h3 className="text-xl font-bold text-dark-50 mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-cyan-300 text-xs mb-2">/{blog.slug}</p>
                {blog.author && (
                  <p className="text-dark-400 text-sm mb-3">By {blog.author}</p>
                )}
                {blog.summary && (
                  <p className="text-dark-200 text-sm mb-3 line-clamp-2">
                    {blog.summary}
                  </p>
                )}
                <p className="text-dark-300 text-sm mb-4 line-clamp-3">
                  {blog.content}
                </p>
                <div className="flex items-center justify-between text-xs mb-4">
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
                    <span className="text-dark-400">
                      Created {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(blog)}
                    disabled={deletingId === blog.id}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium px-3 py-2 rounded-lg text-sm transition flex-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => requestDelete(blog.id)}
                    disabled={deletingId === blog.id}
                    className="bg-rose-500 hover:bg-rose-400 text-slate-950 font-medium px-3 py-2 rounded-lg text-sm transition flex-1"
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
