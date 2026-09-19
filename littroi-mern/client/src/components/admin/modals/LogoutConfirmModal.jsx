import React from "react";
import { LogOut } from "lucide-react";

export function LogoutConfirmModal({ isOpen, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="max-w-md w-full bg-[#0d0d0d] border border-white/15 rounded-[28px] p-6 sm:p-8 space-y-6 relative shadow-2xl text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto shadow-lg">
          <LogOut size={26} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            Log Out of Admin Console?
          </h3>
          <p className="text-xs text-white/50 leading-relaxed">
            Your active session and authorization token will be cleared. You will need to enter your admin credentials to access the studio again.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-full text-xs font-bold text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Confirm Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
