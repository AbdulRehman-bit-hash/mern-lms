export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-parchment/40 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between gap-4 text-sm text-ink/60">
        <p className="font-display text-lg text-ledger">Ledger</p>
        <p>&copy; {new Date().getFullYear()} Ledger LMS. Built to be built upon.</p>
      </div>
    </footer>
  );
}
