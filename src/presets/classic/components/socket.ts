import { css, html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import { ClassicPreset } from 'rete'

export class SocketElement<T extends ClassicPreset.Socket> extends LitElement {
  @property({ type: Object }) accessor data: T | null = null

  static styles = css`
    :host {
      --socket-color: #96b38a;
      --socket-size: 24px;
      --socket-margin: 6px;
      --border-width: 1px;
      --hover-border-width: 4px;
      --multiple-border-color: yellow;
    }

    .styles {
      display: inline-block;
      cursor: pointer;
      border: var(--border-width) solid white;
      border-radius: calc(var(--socket-size) / 2);
      width: var(--socket-size);
      height: var(--socket-size);
      vertical-align: middle;
      background: var(--socket-color);
      z-index: 2;
      box-sizing: border-box;
    }

    .styles:hover {
      border-width: var(--hover-border-width);
    }

    .multiple {
      border-color: var(--multiple-border-color);
    }

    .hoverable {
      border-radius: calc((var(--socket-size) + var(--socket-margin) * 2) / 2);
      padding: var(--socket-margin);
    }

    .hoverable:hover .styles {
      border-width: var(--hover-border-width);
    }
  `

  render() {
    return html`
      <div class="hoverable">
        <div class="styles" title="${this.data?.name}"></div>
      </div>
    `
  }
}
