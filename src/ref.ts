import { property } from 'lit/decorators.js'

import { ClassicScheme, LitArea2D } from '.'
import { MovableElement } from './utils'

export class RefElement extends MovableElement {
  @property({ type: Object }) accessor data!: any
  @property({ type: Function }) accessor emit!: (props: LitArea2D<ClassicScheme>) => void

  mounted() {
    this.emit({ type: 'render', data: {
      ...this.data,
      element: this
    } })
  }

  unmounted() {
    this.emit({ type: 'unmount', data: { element: this } })
  }

  createRenderRoot() {
    this.style.display = 'block'
    return this
  }
}
