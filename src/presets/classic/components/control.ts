import { css, html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import { ClassicPreset } from 'rete'

export class ControlElement<N extends 'text' | 'number'> extends LitElement {
  @property({ type: Object }) accessor data: ClassicPreset.InputControl<N> | null = null

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

  handleInput(e: InputEvent) {
    if (!this.data) return

    const target = e.target as HTMLInputElement
    const val = this.data.type === 'number' ? +target.value : target.value

    this.data.setValue(val as typeof this.data['value'])
  }

  render() {
    if (!this.data) return html``

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
