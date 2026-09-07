"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SessionUser } from "@/lib/auth";

export function AccountMenu({ user }: { user: SessionUser | null }) {
  const router = useRouter();
  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); router.refresh(); router.push("/"); }
  if (!user) return <div className="flex items-center gap-3 text-sm"><Link href="/login" className="text-zinc-300 hover:text-white">Log in</Link><Link href="/register" className="rounded-full bg-amber-400 px-4 py-2 font-semibold text-black hover:bg-amber-300">Join</Link></div>;
  return <div className="flex items-center gap-3 text-sm"><Link href="/watchlist" className="hidden text-zinc-300 hover:text-white sm:block">Watchlist</Link><Link href="/profile" className="grid h-8 w-8 place-items-center rounded-full bg-zinc-700 font-bold text-white" title="Profile">{user.name.slice(0, 1).toUpperCase()}</Link><button onClick={logout} className="text-zinc-400 hover:text-white">Log out</button></div>;
}
