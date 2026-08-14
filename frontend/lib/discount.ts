// (estimatedPrice - price) / estimatedPrice * 100, rounded down. Returns 0
// if there's no real discount (missing estimatedPrice, or it's not actually
// higher than the current price) rather than a negative or NaN value.
export function getDiscountPercent(
  price: number,
  estimatedPrice?: number
): number {
  if (!estimatedPrice || estimatedPrice <= price) return 0;
  return Math.floor(((estimatedPrice - price) / estimatedPrice) * 100);
}
