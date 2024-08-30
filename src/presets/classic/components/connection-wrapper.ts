export type { ClassicScheme, LitArea2D, RenderEmit } from '..'
import { LitElement } from 'lit'
import { property } from 'lit/decorators.js'

import { Position } from '../../../types'

type PositionWatcher = (cb: (value: Position) => void) => (() => void)

export class ConnectionWrapperElement extends LitElement {
  @property() accessor start!: Position | PositionWatcher
  @property() accessor end!: Position | PositionWatcher
  @property() accessor path!: (start: Position, end: Position) => Promise<null | string>
  @property() accessor component!: (path: string | null, start: Position | null, end: Position | null) => unknown

  render() {
    return this.component(this.computedPath, this.computedStart, this.computedEnd)
  }

  computedStart: Position | null = null
  computedEnd: Position | null = null
  @property({ reflect: false })
  accessor computedPath!: string | null
  unwatch1: false | (() => void) = false
  unwatch2: false | (() => void) = false

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

    if (this.unwatch1) {
      this.unwatch1()
    }
    if (this.unwatch2) {
      this.unwatch2()
    }
  }

  updatePath(): void {
    if (this.computedStart && this.computedEnd) void this.path(this.computedStart, this.computedEnd)
      .then(path => {
        this.computedPath = path
      })
  }
}
