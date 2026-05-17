const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return dateFormatter.format(new Date(iso));
}

const priceFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatPrice(eur: number | null | undefined): string {
  if (eur === null || eur === undefined) return "";
  return priceFormatter.format(eur);
}
