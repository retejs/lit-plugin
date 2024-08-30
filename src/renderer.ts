import { html, nothing, ReactiveElement, render, TemplateResult } from 'lit'

export type Renderer<P extends Record<string, any>> = {
  get(element: HTMLElement): (ReactiveElement & P) | undefined
  mount(element: HTMLElement, slot: TemplateResult<1 | 2 | 3>, onRendered: () => void): void
  update(app: ReactiveElement & P, payload: P): void
  unmount(element: HTMLElement): void
}

export function getRenderer<P extends Record<string, any>>(): Renderer<P> {
  const instances = new Map<Element, ReactiveElement & P>()

  return {
    get(element) {
      return instances.get(element)
    },
    mount(element, slot, onRendered) {
      render(html`
        <rete-root
          fragment
          .rendered=${onRendered}
        >
          ${slot}
        </rete-root>
      `, element)

      const app = element.children[0].children[0] as ReactiveElement & P

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
        render(nothing, element)
        instances.delete(element)
      }
    }
  }
}
