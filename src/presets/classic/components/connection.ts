/* eslint-disable no-console */
export type { ClassicScheme, LitArea2D, RenderEmit } from '..'
import { css, html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'

import { Position } from '../../../types'

type PositionWatcher = (cb: (value: Position) => void) => (() => void)

export class ConnectionElement extends LitElement {
  @property() accessor start!: Position | PositionWatcher
  @property() accessor end!: Position | PositionWatcher
  @property() accessor path!: (start: Position, end: Position) => Promise<null | string>

  static styles = css`
    svg {
      overflow: visible !important;
      position: absolute;
      pointer-events: none;
      width: 9999px;
      height: 9999px;
    }

    path {
      fill: none;
      stroke-width: 5px;
      stroke: steelblue;
      pointer-events: auto;
    }
  `

  render() {
    return html`
      <svg data-testid="connection">
        <path d=${this.computedPath}></path>
      </svg>
    `
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

  disconnectedCallback(): void {
    super.disconnectedCallback()

    this.unwatch1 && this.unwatch1()
    this.unwatch2 && this.unwatch2()
  }

  updatePath(): void {
    if (this.computedStart && this.computedEnd) this.path(this.computedStart, this.computedEnd).then(path => {
      this.computedPath = path
    })
  }
}
