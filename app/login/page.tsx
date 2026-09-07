import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
export default function LoginPage() { return <div className="mx-auto max-w-md px-4 py-20"><h1 className="text-3xl font-black">Welcome back</h1><p className="mt-2 text-zinc-400">Log in to rate, review, and save movies.</p><div className="mt-8 rounded-xl border bg-zinc-950 p-6"><AuthForm mode="login"/></div><p className="mt-5 text-center text-sm text-zinc-500">New to CineHub? <Link href="/register" className="text-amber-400">Create an account</Link></p></div>; }
