import { css, html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'

import { px, styleMap } from '../utils'

export class MiniNode extends LitElement {
  @property({ type: Number }) accessor left!: number
  @property({ type: Number }) accessor top!: number
  @property({ type: Number }) accessor width!: number
  @property({ type: Number }) accessor height!: number

  get styles() {
    return {
      left: px(this.left),
      top: px(this.top),
      width: px(this.width),
      height: px(this.height)
    }
  }

  static styles = css`
    .mini-node {
      position: absolute;
      background: rgba(110, 136, 255, 0.8);
      border: 1px solid rgb(192 206 212 / 60%);
    }
  `

  render() {
    return html`
      <div class="mini-node" style=${styleMap(this.styles)} data-testid="minimap-node"></div>
    `
  }
}
