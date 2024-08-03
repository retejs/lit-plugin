import { BaseSchemes } from 'rete'

import { LitPlugin } from '..'

export type RenderPreset<Schemes extends BaseSchemes, T> = {
  attach?: (plugin: LitPlugin<Schemes, T>) => void
  render: (context: Extract<T, { type: 'render' }>, plugin: LitPlugin<Schemes, T>) => unknown | null | undefined
}
