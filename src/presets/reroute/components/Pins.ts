import { css, html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'

import { GetPointer } from '../../../shared/drag'
import { Position } from '../types'

export class Pins extends LitElement {
  @property({ type: Array }) accessor pins: Array<{ id: string, position: Position, selected: boolean }> = []
  @property({ type: Function }) accessor onMenu: (id: string) => void = () => null
  @property({ type: Function }) accessor onTranslate: ((id: string, dx: number, dy: number) => void) = () => null
  @property({ type: Function }) accessor onDown: (id: string) => void = () => null
  @property({ type: Function }) accessor getPointer: GetPointer = () => null

  static styles = css`
    .pins {
      display: flex;
      flex-direction: column;
    }
  `
  render() {
    return html`
      <div class="pins">
        ${this.pins.map(pin => html`
          <rete-pin
            .position=${pin.position}
            .selected=${pin.selected}
            .getPointer=${this.getPointer}
            @menu=${() => this.onMenu(pin.id)}
            @translate=${(e: CustomEvent) => this.onTranslate(pin.id, e.detail.dx, e.detail.dy)}
            @down=${() => this.onDown(pin.id)}
          ></rete-pin>
        `)}
      </div>
    `
  }
}
