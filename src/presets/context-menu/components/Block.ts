import { css, html, LitElement } from 'lit'

// import { unsafeCSS } from 'lit/directives/unsafe-css.js';
// import contextVars from '../context-vars.scss'; // Assume context-vars.scss is preprocessed to a JS module

export class Block extends LitElement {
  static styles = css`
    .block {
      color: #fff;
      padding: 4px;
      border-bottom: 1px solid var(--context-color-dark);
      background-color: var(--context-color);
      cursor: pointer;
      box-sizing: border-box;
      width: 100%;
      position: relative;
    }

    .block:first-child {
      border-top-left-radius: var(--context-menu-round);
      border-top-right-radius: var(--context-menu-round);
    }

    .block:last-child {
      border-bottom-left-radius: var(--context-menu-round);
      border-bottom-right-radius: var(--context-menu-round);
    }

    .block:hover {
      background-color: var(--context-color-light);
    }
  `

  render() {
    return html`
      <div class="block">
        <slot></slot>
      </div>
    `
  }
}
