export function px(value: number) {
  return `${value}px`
}

export function styleMap(styles: { [key: string]: string }) {
  return Object.entries(styles)
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ')
}
