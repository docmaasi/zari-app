"use client";

import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useState } from "react";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Download, Loader2 } from "lucide-react";

/**
 * Account management page. Clerk's <UserProfile /> covers email,
 * password, 2FA, sessions, AND account deletion in-app (App-Store
 * compliant). A "Download my data" button above it handles GDPR
 * Article 20 (data portability).
 */
export default function AccountPage(): React.ReactNode {
  const convex = useConvex();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (): Promise<void> => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const payload = await convex.query(api.userData.exportMyData, {});
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `zari-data-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error("Data export failed:", err);
      alert("Could not export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Account</h1>
          <p className="text-sm text-slate-400">
            Manage your profile, security, and data
          </p>
        </div>

        {/* GDPR Article 20 data export */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-sm font-semibold text-white">Download my data</h2>
              <p className="text-xs text-slate-400 mt-1">
                A JSON copy of your conversations, memories, and account history.
              </p>
            </div>
            <button
              onClick={() => void handleExport()}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/[0.06] text-sm font-medium text-white hover:bg-white/[0.1] disabled:opacity-50 min-h-10"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isExporting ? "Preparing…" : "Download"}
            </button>
          </div>
        </div>

        {/* Clerk's built-in account manager */}
        <UserProfile
          routing="hash"
          appearance={{
            baseTheme: dark,
            elements: {
              rootBox: { width: "100%" },
              cardBox: { width: "100%", boxShadow: "none" },
            },
          }}
        />
      </div>
    </div>
  );
}
