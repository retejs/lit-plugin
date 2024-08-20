import { css, html, LitElement } from 'lit'

export class BlockElement extends LitElement {
  static styles = css`
    :host {
      color: #fff;
      padding: 4px;
      border-bottom: 1px solid var(--context-color-dark);
      background-color: var(--context-color);
      cursor: pointer;
      box-sizing: border-box;
      width: 100%;
      position: relative;
      display: block;
    }

    :host(:first-child) {
      border-top-left-radius: var(--context-menu-round);
      border-top-right-radius: var(--context-menu-round);
    }

    :host(:last-child) {
      border-bottom-left-radius: var(--context-menu-round);
      border-bottom-right-radius: var(--context-menu-round);
    }

    :host(:hover) {
      background-color: var(--context-color-light);
    }
  `

  render() {
    return html`
      <slot></slot>
    `
  }
}
