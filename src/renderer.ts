/* eslint-disable no-console */
import { html, ReactiveElement, render } from 'lit'

export type Renderer = {
  get(element: Element): ReactiveElement | undefined
  mount(element: HTMLElement, slot: any, onRendered: any): void
  update<P extends Record<string, any>>(app: ReactiveElement & P, payload: P): void
  unmount(element: Element): void
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
        element.innerHTML = ''
        instances.delete(element)
      }
    }
  }
}
