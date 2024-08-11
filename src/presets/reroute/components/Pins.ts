/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/naming-convention */
import { css, html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'

export class Pins extends LitElement {
  @property({ type: Array }) accessor pins: Array<{ id: string, position: { x: number, y: number }, selected: boolean }> = []
  @property({ type: Function }) accessor menu: (id: string) => void = () => {}
  @property({ type: Function }) accessor translate: any = () => {}
  @property({ type: Function }) accessor down: (id: string) => void = () => {}
  @property({ type: Function }) accessor getPointer: () => any = () => null

  static styles = css`
    .pins {
      display: flex;
      flex-direction: column;
    }
  `

  private _onMenu(id: string) {
    this.menu(id)
  }

  private _onTranslate(id: string, dx: number, dy: number) {
    this.translate(id, dx, dy)
  }

  private _onDown(id: string) {
    this.down(id)
  }

  render() {
    return html`
      <div class="pins">
        ${this.pins.map(pin => html`
          <rete-pin
            .position=${pin.position}
            .selected=${pin.selected}
            .getPointer=${this.getPointer}
            @menu=${() => this._onMenu(pin.id)}
            @translate=${(e: CustomEvent) => this._onTranslate(pin.id, e.detail.dx, e.detail.dy)}
            @down=${() => this._onDown(pin.id)}
          ></rete-pin>
        `)}
      </div>
    `
  }
}
