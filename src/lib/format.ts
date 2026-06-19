/**
 * Format an integer ARS amount for display.
 *
 * @param n - Price in ARS as a plain integer (e.g. `199000`).
 * @returns The price prefixed with `AR$` using a dot as the thousands
 *   separator, e.g. `formatPriceARS(199000)` → `"AR$199.000"`.
 */
export function formatPriceParts(n: number): { currency: string; amount: string } {
  const amount = Math.trunc(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  return { currency: "AR$", amount }
}

export function formatPriceARS(n: number): string {
  const { currency, amount } = formatPriceParts(n)
  return `${currency}${amount}`
}
