export function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatterCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);
}
