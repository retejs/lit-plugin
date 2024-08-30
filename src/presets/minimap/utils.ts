export function px(value: number) {
  return `${value}px`
}

export function styleMap(styles: Record<string, string>) {
  return Object.entries(styles)
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ')
}
