/* eslint-disable max-statements */
/* eslint-disable no-console */
import { BaseSchemes, CanAssignSignal, Scope } from 'rete'

import { RenderPreset } from './presets/types'
export type { ClassicScheme, LitArea2D, RenderEmit } from './presets/classic'
import { html, LitElement, render } from 'lit'
import { property } from 'lit/decorators.js'

import { Position, RenderSignal } from './types'

export * as Presets from './presets'
export * from './types'

class RootElement extends LitElement {
  @property({ type: Function }) accessor rendered: any = null

  connectedCallback(): void {
    super.connectedCallback()
    this.rendered && this.rendered()
  }

  createRenderRoot() {
    return this
  }
}
customElements.define('rete-root', RootElement)

/**
 * Signals that can be emitted by the plugin
 * @priority 9
 */
export type Produces<Schemes extends BaseSchemes> =
  | { type: 'connectionpath', data: { payload: Schemes['Connection'], path?: string, points: Position[] } }

type Requires<Schemes extends BaseSchemes> =
  | RenderSignal<'node', { payload: Schemes['Node'] }>
  | RenderSignal<'connection', { payload: Schemes['Connection'], start?: Position, end?: Position }>
  | { type: 'unmount', data: { element: HTMLElement } }

/**
 * React plugin. Renders nodes, connections and other elements using React.
 * @priority 10
 * @emits connectionpath
 * @listens render
 * @listens unmount
 */
export class LitPlugin<Schemes extends BaseSchemes, T = Requires<Schemes>> extends Scope<Produces<Schemes>, [Requires<Schemes> | T]> {
  presets: RenderPreset<Schemes, T>[] = []

  constructor() {
    super('lit')

    this.addPipe(context => {
      if (!context || typeof context !== 'object' || !('type' in context)) return context
      if (context.type === 'unmount') {
        this.unmount(context.data.element)
      } else if (context.type === 'render') {
        if ('filled' in context.data && context.data.filled) {
          return context
        }
        if (this.mount(context.data.element, context)) {
          return {
            ...context,
            data: {
              ...context.data,
              filled: true
            }
          } as typeof context
        }
      }

      return context
    })
  }

  setParent(scope: Scope<Requires<Schemes> | T>): void {
    super.setParent(scope)

    this.presets.forEach(preset => {
      if (preset.attach) preset.attach(this)
    })
  }

  private mount(element: HTMLElement, context: Requires<Schemes>) {
    const parent = this.parentScope()

    for (const preset of this.presets) {
      const result = preset.render(context as any, this)

      if (!result) continue

      render(html`
        <rete-root
          .rendered=${() => parent.emit({ type: 'rendered', data: context.data } as T)}
        >
          ${result}
        </rete-root>
      `, element)

      return true
    }
  }

  private unmount(element: HTMLElement) {
    console.log('unmount', element)
    // element.innerHTML = ''
  }

  /**
   * Adds a preset to the plugin.
   * @param preset Preset that can render nodes, connections and other elements.
   */
  public addPreset<K>(preset: RenderPreset<Schemes, CanAssignSignal<T, K> extends true ? K : 'Cannot apply preset. Provided signals are not compatible'>) {
    const local = preset as RenderPreset<Schemes, T>

    if (local.attach) local.attach(this)
    this.presets.push(local)
  }
}
