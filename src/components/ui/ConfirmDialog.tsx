"use client";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative w-full max-w-md glass rounded-2xl p-6 border border-white/15">
        <h3 className="text-lg font-bold text-dark-50">{title}</h3>
        <p className="text-dark-300 mt-2">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="glass-soft hover:bg-slate-700/60 text-dark-100 px-4 py-2 rounded-xl transition"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="bg-rose-500 hover:bg-rose-400 text-slate-950 font-semibold px-4 py-2 rounded-xl transition"
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
