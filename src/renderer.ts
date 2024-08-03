/* eslint-disable no-console */
import { html, nothing, ReactiveElement, render } from 'lit'

export type Renderer = {
  get(element: HTMLElement): ReactiveElement | undefined
  mount(element: HTMLElement, slot: any, onRendered: any): void
  update<P extends Record<string, any>>(app: ReactiveElement & P, payload: P): void
  unmount(element: HTMLElement): void
}

export function getRenderer(): Renderer {
  const instances = new Map<Element, ReactiveElement>()

  return {
    get(element) {
      return instances.get(element)
    },
    mount(element, slot, onRendered) {
      render(html`
        <rete-root
          .rendered=${onRendered}
        >
          ${slot}
        </rete-root>
      `, element)

      const app = element.children[0]?.children[0] as ReactiveElement

      if (!app) throw new Error('no instance found')

      console.log('mounting', element, app)
      instances.set(element, app)
    },
    update(app, payload) {
      Object.keys(payload).forEach(key => {
        app[key as keyof typeof app] = payload[key]
      })
      app.requestUpdate()
    },
    unmount(element) {
      const app = instances.get(element)

      if (app) {
        render(nothing, element)
        instances.delete(element)
      }
    }
  }
}
