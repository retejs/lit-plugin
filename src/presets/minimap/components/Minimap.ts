import './MiniNode.js'
import './MiniViewport.js'

import { css, html, LitElement } from 'lit'
import { property, query } from 'lit/decorators.js'

import { Rect, Translate } from '../types'
import { px } from '../utils.js'

export class Minimap extends LitElement {
  @property({ type: Number }) accessor size = 0
  @property({ type: Number }) accessor ratio = 1
  @property({ type: Array }) accessor nodes: Rect[] = []
  @property({ type: Object }) accessor viewport!: Rect
  @property({ type: Function }) accessor onTranslate!: Translate
  @property({ type: Function }) accessor point!: (x: number, y: number) => void

  @query('.minimap') accessor container!: HTMLElement

  static styles = css`
    .minimap {
      position: absolute;
      right: 24px;
      bottom: 24px;
      background: rgba(229, 234, 239, 0.65);
      padding: 20px;
      overflow: hidden;
      border: 1px solid #b1b7ff;
      border-radius: 8px;
      box-sizing: border-box;
    }
  `

  render() {
    return html`
      <div
        class="minimap"
        style="width: ${px(this.size * this.ratio)}; height: ${px(this.size)}"
        @pointerdown="${this.preventDefault}"
        @dblclick="${this.dblclick}"
        data-testid="minimap"
      >
        ${this.nodes.map((node, index) =>
    html`<rete-mini-node
            .left="${this.scale(node.left)}"
            .top="${this.scale(node.top)}"
            .width="${this.scale(node.width)}"
            .height="${this.scale(node.height)}"
            key="${index}_${node.left}"
          ></rete-mini-node>`
  )}
      <rete-mini-viewport
        .left="${this.viewport.left}"
        .top="${this.viewport.top}"
        .width="${this.viewport.width}"
        .height="${this.viewport.height}"
        .containerWidth="${this.container ? this.container.clientWidth : 0}"
        .onTranslate="${this.onTranslate}"
      ></rete-mini-viewport>
      </div>
    `
  }

  scale(value: number): number {
    return this.container ? value * this.container.clientWidth : 0
  }

  preventDefault(event: Event) {
    event.stopPropagation()
    event.preventDefault()
  }

  dblclick(event: MouseEvent) {
    if (!this.container) return
    const box = this.container.getBoundingClientRect()
    const x = (event.clientX - box.left) / (this.size * this.ratio)
    const y = (event.clientY - box.top) / (this.size * this.ratio)

    this.point(x, y)
  }
}
