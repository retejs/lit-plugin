export type { ClassicScheme, LitArea2D, RenderEmit } from '..'
import { css, html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'

import { Position } from '../../../types'

export class ConnectionElement extends LitElement {
  @property() accessor start!: Position
  @property() accessor end!: Position
  @property() accessor path!: string

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
        <path d=${this.path}></path>
      </svg>
    `
  }
}
