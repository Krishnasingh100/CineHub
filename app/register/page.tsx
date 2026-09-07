import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
export default function RegisterPage() { return <div className="mx-auto max-w-md px-4 py-20"><h1 className="text-3xl font-black">Join CineHub</h1><p className="mt-2 text-zinc-400">Your watchlist and your point of view, in one place.</p><div className="mt-8 rounded-xl border bg-zinc-950 p-6"><AuthForm mode="register"/></div><p className="mt-5 text-center text-sm text-zinc-500">Already have an account? <Link href="/login" className="text-amber-400">Log in</Link></p></div>; }
