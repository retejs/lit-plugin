import { css, html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'

import { GetPointer, useDrag } from '../../../shared/drag'
import { Position } from '../types'

const pinSize = 20

export class Pin extends LitElement {
  @property({ type: Object }) accessor position: Position = { x: 0, y: 0 }
  @property({ type: Boolean }) accessor selected = false
  @property({ type: Function }) accessor getPointer: GetPointer = () => null

  private drag: null | ReturnType<typeof useDrag> = null

  connectedCallback(): void {
    super.connectedCallback()
    this.drag = useDrag(this.onDrag.bind(this), this.getPointer)
  }

  static styles = css`
    :host {
      display: block;
    }
    .pin {
      width: ${pinSize}px;
      height: ${pinSize}px;
      box-sizing: border-box;
      background: steelblue;
      border: 2px solid white;
      border-radius: ${pinSize}px;
      position: absolute;
    }
    .selected {
      background: #ffd92c;
    }
  `

  render() {
    const style = `
      top: ${this.position.y - pinSize / 2}px;
      left: ${this.position.x - pinSize / 2}px;
    `

    return html`
      <div
        class="pin ${this.selected
    ? 'selected'
    : ''}"
        style="${style}"
        @pointerdown="${this.onPointerDown}"
        @contextmenu="${this.onContextMenu}"
        data-testid="pin"
      ></div>
    `
  }

  private onPointerDown(event: PointerEvent) {
    event.stopPropagation()
    event.preventDefault()
    this.drag?.start(event)
    this.dispatchEvent(new CustomEvent('down', { detail: event }))
  }

  private onContextMenu(event: MouseEvent) {
    event.stopPropagation()
    event.preventDefault()
    this.dispatchEvent(new CustomEvent('menu', { detail: event }))
  }

  private onDrag(dx: number, dy: number) {
    this.dispatchEvent(new CustomEvent('translate', { detail: { dx, dy } }))
  }
}
