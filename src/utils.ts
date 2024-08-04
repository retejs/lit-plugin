import { LitElement } from 'lit'

export abstract class MovableElement extends LitElement {
  beingMoved = false

  abstract mounted(): void
  abstract unmounted(): void

  connectedCallback() {
    super.connectedCallback()
    if (!this.beingMoved) {
      this.mounted()
    }
    this.beingMoved = false
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.beingMoved = true
    queueMicrotask(() => {
      if (this.beingMoved) {
        this.unmounted()
      }
    })
  }
}
