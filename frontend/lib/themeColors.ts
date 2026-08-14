// These values must stay in sync with the CSS variables defined in
// app/globals.css. They exist because some libraries (recharts, Stripe
// Elements) take literal color strings as JS props rather than reading
// CSS custom properties, so they can't pick up the .dark class toggle on
// their own — components using them read the current theme via useTheme()
// and select the matching palette here instead.

export const themeColors = {
  light: {
    paper: "#FAFAF8",
    surface: "#FFFFFF",
    surface2: "#EFEAE0",
    ink: "#1C1B1A",
    ledger: "#2B3A67",
    ledgerDark: "#1F2A4D",
    gold: "#C8963E",
    oxblood: "#8C3A3A",
    moss: "#3F7859",
  },
  dark: {
    paper: "#15130F",
    surface: "#1E1B15",
    surface2: "#28241C",
    ink: "#F3EEE2",
    ledger: "#C9A227",
    ledgerDark: "#A6841D",
    gold: "#E3C567",
    oxblood: "#8C3A3A",
    moss: "#5B8C6F",
  },
} as const;

export type ThemeColorKey = keyof typeof themeColors.light;