import { css, html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'

export class ControlElement extends LitElement {
  @property({ type: Object }) accessor data: any = {}

  static styles = css`
    input {
      width: 100%;
      border-radius: 30px;
      background-color: white;
      padding: 2px 6px;
      border: 1px solid #999;
      font-size: 110%;
      box-sizing: border-box;
    }
  `

  handleInput(e: any) {
    const val = this.data.type === 'number' ? +e.target.value : e.target.value

    this.data.setValue(val)
  }

  render() {
    return html`
      <input
        type="${this.data.type}"
        .value="${this.data.value}"
        ?readonly="${this.data.readonly}"
        @input="${this.handleInput}"
        @pointerdown="${(e: MouseEvent) => e.stopPropagation()}"
      />
    `
  }
}
