"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { FiSearch, FiX } from "react-icons/fi";
import { RootState } from "@/redux/store";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
  { title: "Home", href: "/" },
  { title: "Courses", href: "/courses" },
  { title: "About", href: "/about" },
];

export default function Header() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/courses?q=${encodeURIComponent(trimmed)}` : "/courses");
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <header className="border-b border-ink/10 bg-paper sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl tracking-tight text-ledger">
          Ledger
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-body text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline text-ink/70 hover:text-ink transition-colors"
            >
              {link.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex items-center">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onBlur={() => !query && setSearchOpen(false)}
                  placeholder="Search courses…"
                  className="w-40 sm:w-56 border-b border-ink/20 bg-transparent px-1 py-1 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:border-gold transition-colors"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setQuery("");
                  }}
                  className="ml-1 text-ink/40 hover:text-ink"
                  aria-label="Close search"
                >
                  <FiX size={16} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="text-ink/60 hover:text-gold transition-colors"
                aria-label="Search courses"
              >
                <FiSearch size={18} />
              </button>
            )}
          </div>

          <ThemeToggle />

          {user ? (
            <>
              <Link
                href="/my-courses"
                className="text-sm text-ink/70 hover:text-ink transition-colors hidden sm:inline"
              >
                My Courses
              </Link>
              <Link
                href="/orders"
                className="text-sm text-ink/70 hover:text-ink transition-colors hidden sm:inline"
              >
                Orders
              </Link>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-sm text-ink/70 hover:text-ink transition-colors hidden sm:inline"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/profile"
                className="flex items-center gap-2 pl-1 pr-4 py-1 rounded-full bg-ledger text-paper text-sm font-medium hover:bg-ledger-dark transition-colors"
              >
                <span className="w-7 h-7 rounded-full overflow-hidden bg-paper/20 flex items-center justify-center flex-shrink-0">
                  {user.avatar?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatar.url}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-display">
                      {user.name?.[0]?.toUpperCase() || "?"}
                    </span>
                  )}
                </span>
                {user.name?.split(" ")[0] || "Account"}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-ink/70 hover:text-ink transition-colors hidden sm:inline"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-sm bg-ledger text-paper text-sm font-medium hover:bg-ledger-dark transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
