import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";

export function DeleteConfirmModal({ deleteConfirm, onCancel, onConfirm }) {
  if (!deleteConfirm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="max-w-md w-full bg-[#0d0d0d] border border-red-500/25 rounded-[28px] p-6 sm:p-8 space-y-6 relative shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_50px_rgba(239,68,68,0.15)] overflow-hidden">
        <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent pointer-events-none" />

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0 shadow-lg">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              Confirm Deletion
            </h3>
            <p className="text-xs text-white/50">This action cannot be undone</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
          Are you sure you want to delete <strong className="text-white font-bold">"{deleteConfirm.title}"</strong>? It will be immediately removed from the live website and database.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold transition-all cursor-pointer"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all cursor-pointer"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            <Trash2 size={14} />
            <span>Yes, Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
