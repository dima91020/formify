'use client'

import { setTitle } from "@/store/slices/formSlice";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { SYNC_STATUS } from "@/components/builder/FormBuilder";
import clsx from "clsx";
import Link from "next/link";
import { ArrowLeft, Check, CheckCircle2, ExternalLink, Layers, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

const TABS = [
    { id: "questions", label: "Questions", icon: Layers },
    { id: "logic", label: "Logic Map", icon: Sparkles },
];

export default function BuilderHeader({ syncStatus, formId }: { syncStatus: SYNC_STATUS; formId?: string }) {
    const dispatch = useAppDispatch();
    const formState = useAppSelector(state => state.form);

    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get("tab") || "questions";
    const [copied, setCopied] = useState(false);

    const handleTabChange = (newTab: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", newTab);
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleCopyLink = () => {
        if (!formId) return;
        navigator.clipboard.writeText(`${window.location.origin}/f/${formId}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <header className="h-16 border-b border-zinc-200/80 px-6 flex items-center justify-between bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-2xs">
            <div className="flex items-center gap-3.5 max-w-sm w-full">
                <Link
                    href="/dashboard"
                    className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
                    title="Back to Dashboard"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div className="h-5 w-px bg-zinc-200" />
                <input
                    className="text-sm font-semibold text-zinc-900 bg-transparent hover:bg-zinc-100/70 focus:bg-white focus:ring-1 focus:ring-zinc-900 rounded-lg px-2.5 py-1.5 transition-all w-full truncate placeholder:text-zinc-400"
                    value={formState.title}
                    onChange={(e) => dispatch(setTitle(e.target.value))}
                    placeholder="Untitled Form"
                />
            </div>

            <div className="flex items-center p-1 rounded-xl bg-zinc-100 border border-zinc-200/80 text-xs font-medium">
                {TABS.map((tab) => {
                    const { id, label, icon: Icon } = tab;
                    const isActive = currentTab === id;
                    
                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => handleTabChange(id)}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all select-none cursor-pointer",
                                isActive
                                    ? "bg-white text-zinc-950 font-semibold shadow-xs"
                                    : "text-zinc-500 hover:text-zinc-900"
                            )}
                        >
                            <Icon className="h-3.5 w-3.5" />
                            <span>{label}</span>
                        </button>
                    );
                })}
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-medium">
                    {syncStatus === SYNC_STATUS.Saving && (
                        <span className="flex items-center gap-1.5 text-zinc-500">
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-400" />
                            <span>Saving...</span>
                        </span>
                    )}
                    {syncStatus === SYNC_STATUS.Saved && (
                        <span className="flex items-center gap-1.5 text-emerald-600">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Saved</span>
                        </span>
                    )}
                    {syncStatus === SYNC_STATUS.Error && (
                        <span className="flex items-center gap-1.5 text-red-500">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            <span>Error saving</span>
                        </span>
                    )}
                </div>

                {formId && (
                    <button
                        type="button"
                        onClick={handleCopyLink}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-2xs cursor-pointer"
                    >
                        {copied ? (
                            <>
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                                <span className="text-emerald-600">Copied Link!</span>
                            </>
                        ) : (
                            <>
                                <ExternalLink className="h-3.5 w-3.5 text-zinc-500" />
                                <span>Share Form</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </header>
    );
}