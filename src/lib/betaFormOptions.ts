// Single source of truth for the beta form's two dropdowns — shared by the
// client (BetaForm renders the <option> list from these) and the server
// (the /api/beta route rejects anything outside this exact set), so the two
// can never drift out of sync the way two separate hardcoded lists would.
export const EMPLOYEE_OPTIONS = ["1-5", "6-20", "21-50", "51-100", "100+"] as const;

export const REVENUE_OPTIONS = ["Under $500K", "$500K-$1M", "$1M-$5M", "$5M-$20M", "$20M+"] as const;
