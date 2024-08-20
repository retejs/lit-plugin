import { LitElement } from 'lit'
import { property } from 'lit/decorators.js'

export class RootElement extends LitElement {
  @property({ type: Function }) accessor rendered: (() => void) | null = null

  connectedCallback(): void {
    super.connectedCallback()
    this.rendered && this.rendered()
  }

  createRenderRoot() {
    return this
  }
}
