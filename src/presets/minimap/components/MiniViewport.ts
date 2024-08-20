import { css, html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'

import { useDrag } from '../../../shared/drag'
import { Translate } from '../types'
import { px, styleMap } from '../utils'

export class MiniViewport extends LitElement {
  @property({ type: Number }) accessor left = 0
  @property({ type: Number }) accessor top = 0
  @property({ type: Number }) accessor width = 0
  @property({ type: Number }) accessor height = 0
  @property({ type: Number }) accessor containerWidth = 0
  @property({ type: Function }) accessor onTranslate: Translate = () => null

  private drag = useDrag(this.onDrag.bind(this), e => ({ x: e.pageX, y: e.pageY }))

  private scale(v: number): number {
    return v * this.containerWidth
  }

  private invert(v: number): number {
    return v / this.containerWidth
  }

  private onDrag(dx: number, dy: number): void {
    this.onTranslate(this.invert(-dx), this.invert(-dy))
  }

  private get styles() {
    return {
      left: px(this.scale(this.left)),
      top: px(this.scale(this.top)),
      width: px(this.scale(this.width)),
      height: px(this.scale(this.height))
    }
  }

  render() {
    return html`
      <div
        @pointerdown=${this.drag.start}
        style=${styleMap(this.styles)}
        data-testid="minimap-viewport"
        class="mini-viewport"
      ></div>
    `
  }

  static styles = css`
    .mini-viewport {
      position: absolute;
      background: rgba(255, 251, 128, 0.32);
      border: 1px solid #ffe52b;
    }
  `
}
