"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { FiSearch, FiX, FiMenu } from "react-icons/fi";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/courses?q=${encodeURIComponent(trimmed)}` : "/courses");
    setSearchOpen(false);
    setQuery("");
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

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

        <div className="flex items-center gap-2 sm:gap-3">
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
                  placeholder="Search…"
                  className="w-28 sm:w-56 border-b border-ink/20 bg-transparent px-1 py-1 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:border-gold transition-colors"
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

          {/* Desktop-only account links — mirrored inside the mobile menu below */}
          {user ? (
            <>
              <Link
                href="/my-courses"
                className="text-sm text-ink/70 hover:text-ink transition-colors hidden md:inline"
              >
                My Courses
              </Link>
              <Link
                href="/orders"
                className="text-sm text-ink/70 hover:text-ink transition-colors hidden md:inline"
              >
                Orders
              </Link>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-sm text-ink/70 hover:text-ink transition-colors hidden md:inline"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/profile"
                className="flex items-center gap-2 pl-1 pr-2 sm:pr-4 py-1 rounded-full bg-ledger text-paper text-sm font-medium hover:bg-ledger-dark transition-colors"
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
                <span className="hidden sm:inline">
                  {user.name?.split(" ")[0] || "Account"}
                </span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-ink/70 hover:text-ink transition-colors hidden md:inline"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-3 sm:px-4 py-2 rounded-sm bg-ledger text-paper text-sm font-medium hover:bg-ledger-dark transition-colors"
              >
                Get started
              </Link>
            </>
          )}

          {/* Hamburger toggle — mobile only. Everything hidden above (nav
              links, My Courses, Orders, Admin, Log in) is reachable here
              instead, so nothing is ever completely inaccessible on a
              small screen. */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden text-ink/70 hover:text-ink transition-colors"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="md:hidden border-t border-ink/10 bg-paper px-6 py-4">
          <nav className="flex flex-col gap-1 mb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="px-2 py-2.5 rounded-sm text-sm text-ink/80 hover:bg-surface-2 transition-colors"
              >
                {link.title}
              </Link>
            ))}
          </nav>

          <div className="border-t border-ink/10 pt-4 flex flex-col gap-1">
            {user ? (
              <>
                <Link
                  href="/my-courses"
                  onClick={closeMenu}
                  className="px-2 py-2.5 rounded-sm text-sm text-ink/80 hover:bg-surface-2 transition-colors"
                >
                  My Courses
                </Link>
                <Link
                  href="/orders"
                  onClick={closeMenu}
                  className="px-2 py-2.5 rounded-sm text-sm text-ink/80 hover:bg-surface-2 transition-colors"
                >
                  Orders
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={closeMenu}
                    className="px-2 py-2.5 rounded-sm text-sm text-ink/80 hover:bg-surface-2 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className="px-2 py-2.5 rounded-sm text-sm text-ink/80 hover:bg-surface-2 transition-colors"
                >
                  Profile
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                onClick={closeMenu}
                className="px-2 py-2.5 rounded-sm text-sm text-ink/80 hover:bg-surface-2 transition-colors"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
