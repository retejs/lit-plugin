/* eslint-disable no-console */
export type { ClassicScheme, LitArea2D, RenderEmit } from '..'
import { LitElement } from 'lit'
import { property } from 'lit/decorators.js'

import { Position } from '../../../types'

type PositionWatcher = (cb: (value: Position) => void) => (() => void)

export class ConnectionWrapperElement extends LitElement {
  @property() accessor start!: Position | PositionWatcher
  @property() accessor end!: Position | PositionWatcher
  @property() accessor path!: (start: Position, end: Position) => Promise<null | string>
  @property() accessor component!: any

  render() {
    return this.component(this.computedPath, this.computedStart, this.computedEnd)
  }

  computedStart: any = null
  computedEnd: any = null
  @property({ reflect: false })
  accessor computedPath!: string | null
  unwatch1: any
  unwatch2: any

  connectedCallback(): void {
    super.connectedCallback()

    this.unwatch1 = typeof this.start === 'function' && this.start(s => {
      this.computedStart = s
      this.updatePath()
    })
    this.unwatch2 = typeof this.end === 'function' && this.end(s => {
      this.computedEnd = s
      this.updatePath()
    })
  }

  updated(changed: Map<string, any>): void {
    if (changed.has('start') && typeof this.start !== 'function') {
      this.computedStart = this.start
      this.updatePath()
    }

    if (changed.has('end') && typeof this.end !== 'function') {
      this.computedEnd = this.end
      this.updatePath()
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    this.unwatch1 && this.unwatch1()
    this.unwatch2 && this.unwatch2()
  }

  updatePath(): void {
    if (this.computedStart && this.computedEnd) this.path(this.computedStart, this.computedEnd)
      .then(path => {
        this.computedPath = path
      })
  }
}
