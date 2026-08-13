"use client"

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { ArrowLeft, ArrowRight, BarChart3, CheckCircle2, LoaderIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState, useTransition } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from 'react-icons/fc';
import { registerUser } from "@/actions/auth.actions";
import { RegisterInput } from "@/schemas/auth.schema";
import { useRouter } from "next/navigation";

const LIVE_EVENTS_WIDGET = [
    { e: 'event: "new_response"', v: '+1 NPS (Score: 10/10)', fontClass: "text-emerald-400 font-semibold" },
    { e: 'rule: "conditional_branch"', v: 'goto("q_developer_role")', fontClass: "text-zinc-300" },
    { e: 'goto("webhook: "slack_alert"', v: 'delivered ➔ #feedback', fontClass: "text-emerald-400 font-semibold" },
];

export default function LoginPage() {
    const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
    const [isPending, startTransition] = useTransition();
    const [fieldErrors, setFieldErrors] = useState<{
        name?: string[];
        email?: string[];
        password?: string[];
    }>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const router = useRouter();

    const handleSumbit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFieldErrors({});
        setGeneralError(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string || "",
            email: formData.get("email") as string || "",
            password: formData.get("password") as string || "",
        }

        startTransition(async () => {
            try {
                if (mode === "signUp") {
                   const newUser = await registerUser(data);

                    if (!newUser.success) {
                        if (newUser.error) {
                            setFieldErrors(newUser.error as typeof fieldErrors);
                        } else if (newUser.message) {
                            setGeneralError(newUser.message);
                        }
                        return
                    }
                }
                
                const result = await signIn("credentials", {
                    email: data.email,
                    password: data.password,
                    redirect: false
                });

                if (result?.error) {
                    setGeneralError("Wrong email or password");
                } else {
                    router.push("/dashboard");
                    router.refresh();
                }
            } catch (error) {
                setGeneralError("An unexpected error occurred. Please try again.");
            }
        });
    }

    return (
        <div className="min-h-screen w-full flex flex-col  md:flex-row font-sans text-foreground">
            <div className="hidden md:flex md:w-1/2 bg-zinc-950 text-white p-12 lg:p-16 flex-col justify-between relative overflow-hidden border-r border-zinc-800">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_50%)] pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
                
                <div className="relative z-10 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 text-white group">
                        <div className="p-1.5 rounded-lg bg-white/10 border border-white/20 text-white group-hover:bg-white group-hover:text-zinc-950 transition-all">
                            <BarChart3 className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tighter">Formify</span>
                    </Link>
                    <Link href="/" className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors">
                        <ArrowLeft className="h-3.5 w-3.5" /> Back to home
                    </Link>
                </div>
                <div className="relative z-10 my-auto space-y-6 max-w-lg">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono text-zinc-300">
                            <Sparkles className="h-3.5 w-3.5 text-zinc-300" />
                            <span>DEVELOPER-FIRST FORM ENGINE</span>
                        </div>

                        <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                            Build forms with the precision of code.
                        </h2>
                        <p className="text-sm lg:text-base text-zinc-400 leading-relaxed font-normal">
                            JSON-driven schemas, real-time WebSocket sentiment streams, and seamless conditional branching.
                        </p>

                        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-2xl space-y-3.5 font-mono text-xs">
                            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5 text-zinc-400 text-[11px]">
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    LIVE WEBSOCKET FEED
                                </span>

                                <span className="text-zinc-500">200 OK</span>
                            </div>

                            <div className="space-y-2 text-zinc-30">
                                {LIVE_EVENTS_WIDGET.map((value, index) => (
                                    <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950 border border-zinc-800/60" key={index}>
                                        <span className="text-zinc-400">{value.e}</span>
                                        <span className={value.fontClass}>{value.v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative z-10 flex items-center justify-between pt-6 border-t border-zinc-800/80 text-xs text-zinc-500 font-mono">
                    <span className="flex items-center gap-1.5 text-zinc-400">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Multi-Tenant Row Isolation
                    </span>
                    <span>MIT OPEN-SOURCE</span>
                </div>
            </div>

            <div className="w-full md:w-1/2 bg-white p-6 sm:p-12 lg:p-20 flex items-center justify-center">
                <div className="w-full max-w-md space-y-8">
                    <div className="md:hidden flex items-center justify-between pb-4 border-b border-zinc-100">
                        <Link href="/" className="flex items-center gap-2 text-zinc-900 font-bold text-lg">
                            <BarChart3 className="h-5 w-5 text-zinc-900" /> Formify
                        </Link>
                        <Link href="/" className="text-xs font-mono text-zinc-500 flex items-center gap-1">
                            <ArrowLeft className="h-3 w-3" /> Home
                        </Link>
                    </div>
                    
                    <div className="space-y-2 text-left">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
                            Welcome to Formify
                        </h1>
                        <p className="text-sm text-zinc-500 font-normal">
                            Sign in to access your dashboard, forms, and live analytics.
                        </p>
                    </div>

                    <div className="p-1 rounded-xl bg-zinc-100 border border-zinc-200 grid grid-cols-2 text-xs font-medium relative select-none">
                        <div
                            className={clsx(
                                "absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-xs transition-transform duration-200 ease-out",
                                mode === "signIn" ? "translate-x-1" : "translate-x-[calc(100%+4px)]"
                            )}
                        />

                        <button
                            type="button"
                            className={clsx(
                                "py-2.5 rounded-lg transition-colors relative z-10 font-medium cursor-pointer text-center",
                                mode === "signIn" ? "text-zinc-950 font-semibold" : "text-zinc-500 hover:text-zinc-800"
                            )}
                            onClick={() => { setMode("signIn"); setGeneralError(null); setFieldErrors({}); }}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            className={clsx(
                                "py-2.5 rounded-lg transition-colors relative z-10 font-medium cursor-pointer text-center",
                                mode === "signUp" ? "text-zinc-950 font-semibold" : "text-zinc-500 hover:text-zinc-800"
                            )}
                            onClick={() => { setMode("signUp"); setGeneralError(null); setFieldErrors({}); }}
                        >
                            Create Account
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            asChild
                            size="lg"
                            type="button"
                            className="flex items-center justify-center gap-2.5 px-8 py-5.5 rounded-xl border border-zinc-200 bg-white text-zinc-800 text-sm font-medium hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-2xs cursor-pointer"
                            onClick={() => signIn("google", { callbackUrl: "/dashboard", redirectTo: "/dashboard" })}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <FcGoogle className="h-4 w-4" />
                                <span>Google</span>
                            </div>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            className="flex items-center justify-center gap-2.5 px-8 py-5.5 rounded-xl border border-zinc-200 bg-white text-zinc-800 text-sm font-medium hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-2xs cursor-pointer"
                            onClick={() => signIn("github", { callbackUrl: "/dashboard", redirectTo: "/dashboard" })}
                        >
                            <div className="flex gap-2 items-center justify-center">
                                <FaGithub className="h-4 w-4 text-zinc-900" />
                                <span>GitHub</span>
                            </div>
                        </Button>
                    </div>

                    <div className="relative flex items-center justify-center">
                        <div className="w-full border-t border-zinc-200" />
                        <span className="absolute bg-white px-3 text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                            or continue with email
                        </span>
                    </div>

                    <form onSubmit={handleSumbit} className="space-y-4 text-left">
                        {mode === "signUp" && (
                            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                                <label className="text-xs font-medium text-zinc-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                                />
                                {fieldErrors.name && (
                                    <p className="text-xs text-red-500 font-medium mt-1 animate-in fade-in duration-150">
                                        {fieldErrors.name[0]}
                                    </p>
                                )}

                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-700">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="developer@company.com"
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                            />
                            {fieldErrors.email && (
                                <p className="text-xs text-red-500 font-medium mt-1 animate-in fade-in duration-150">
                                    {fieldErrors.email[0]}
                                </p>
                            )}

                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-medium text-zinc-700">Password</label>
                                {mode === "signIn" && (
                                    <button type="button" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer">
                                        Forgot password?
                                    </button>                                    
                                )}
                            </div>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                            />
                            {fieldErrors.password && (
                                <p className="text-xs text-red-500 font-medium mt-1 animate-in fade-in duration-150">
                                    {fieldErrors.password[0]}
                                </p>
                            )}

                        </div>

                        {generalError && (
                            <p className="text-xs text-red-500 font-medium text-center mt-1 animate-in fade-in duration-150">
                                {generalError}
                            </p>
                        )}

                        <Button
                            type="submit"
                            size="lg"
                            disabled={isPending}
                            className="w-full py-6 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 disabled:opacity-60 font-semibold text-sm transition-all shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {isPending ? (
                                <>
                                    <LoaderIcon className="h-4 w-4 animate-spin text-zinc-400" />
                                    <span>Please wait...</span>
                                </>
                            ) : (
                                <>
                                    <span>{mode === "signIn" ? "Sign In to Formify" : "Create Your Account"}</span>
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="text-xs text-zinc-400 text-center leading-relaxed">
                        By continuing, you agree to Formify&apos;s{" "}
                        <Link href="/" className="underline hover:text-zinc-600">Terms of Service</Link> and{" "}
                        <Link href="/" className="underline hover:text-zinc-600">Privacy Policy</Link>.
                    </p>
                </div>                 
            </div>
        </div>
    );
}