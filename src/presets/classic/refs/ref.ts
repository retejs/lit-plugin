import { LitElement } from 'lit'
import { property } from 'lit/decorators.js'

import { ClassicScheme, LitArea2D } from '../types'

export class RefElement extends LitElement {
  @property({ type: Object }) accessor data!: any
  @property({ type: Function }) accessor emit!: (props: LitArea2D<ClassicScheme>) => void

  connectedCallback() {
    super.connectedCallback()
    this.emit({ type: 'render', data: {
      ...this.data,
      element: this
    } })
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.emit({ type: 'unmount', data: { element: this } })
  }

  createRenderRoot() {
    this.style.display = 'block'
    return this
  }
}
