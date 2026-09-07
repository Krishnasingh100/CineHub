import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: { default: "CineHub", template: "%s · CineHub" },
  description: "Discover films, share reviews, and keep your watchlist close.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-[#090909] text-zinc-100">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
