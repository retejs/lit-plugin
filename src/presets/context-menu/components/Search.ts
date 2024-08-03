import { css, html, LitElement } from 'lit'
import { state } from 'lit/decorators.js'

export class Search extends LitElement {
  static properties = {
    text: { type: String }
  }

  static styles = css`
    .search {
      color: white;
      padding: 1px 8px;
      border: 1px solid white;
      border-radius: 10px;
      font-size: 16px;
      font-family: serif;
      width: 100%;
      box-sizing: border-box;
      background: transparent;
    }
  `
   @state() accessor text = ''

   constructor() {
     super()
     this.text = ''
   }

   handleInput(event: any) {
     this.text = event.target.value
     const newEvent = new InputEvent('change')

     Object.defineProperty(newEvent, 'target', { writable: false, value: event.target })
     this.dispatchEvent(newEvent)
   }

   render() {
     return html`
      <input
        class="search"
        .value="${this.text}"
        @input="${this.handleInput}"
        data-testid="context-menu-search-input"
      />
    `
   }
}
