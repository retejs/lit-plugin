import { css, html, LitElement } from 'lit'
import { property, state } from 'lit/decorators.js'

import { debounce } from '../utils/debounce'
import { Block } from './Block'

export class Item extends LitElement {
  @property({ type: Array }) accessor subitems: any[] = []
  @property({ type: Number }) accessor delay = 0

  @state() accessor visibleSubitems = false

  hide: any

  static styles = [
    Block.styles,
    css`
      :host {
        padding: 0;
      }
      .content {
        padding: 4px;
      }
      :host(.hasSubitems):after {
        content: '►';
        position: absolute;
        opacity: 0.6;
        right: 5px;
        top: 5px;
        pointer-events: none;
      }
      .subitems {
        position: absolute;
        top: 0;
        left: 100%;
        width: var(--menu-width);
      }
    `
  ]

  connectedCallback() {
    super.connectedCallback()
    this.hide = debounce(this.delay, this.hideSubitems.bind(this))
  }

  hideSubitems() {
    this.visibleSubitems = false
  }

  render() {
    if (this.subitems?.length) {
      this.classList.add('hasSubitems')
    } else {
      this.classList.remove('hasSubitems')
    }
    return html`
      <div data-testid="context-menu-item">
        <div
          class="content"
          @click="${this.handleClick}"
          @wheel="${this.stopEvent}"
          @pointerover="${this.handlePointerOver}"
          @pointerleave="${this.handlePointerLeave}"
          @pointerdown="${this.stopEvent}"
        >
          <slot></slot>
          ${this.subitems && this.visibleSubitems
    ? html`
                <div class="subitems">
                  ${this.subitems.map(
    item => html`
                      <rete-context-menu-item
                        .key="${item.key}"
                        .delay="${this.delay}"
                        .subitems="${item.subitems}"
                        @select="${item.handler}"
                        @hide="${this.handleHide}"
                      >
                        ${item.label}
                      </rete-context-menu-item>
                    `
  )}
                </div>
              `
    : ''}
        </div>
      </div>
    `
  }

  handleClick(event: any) {
    event.stopPropagation()
    this.dispatchEvent(new CustomEvent('select', { detail: event }))
    this.dispatchEvent(new CustomEvent('hide'))
  }

  stopEvent(event: any) {
    event.stopPropagation()
  }

  handlePointerOver() {
    this.hide.cancel()
    this.visibleSubitems = true
  }

  handlePointerLeave() {
    this.hide.call()
  }

  handleHide() {
    this.dispatchEvent(new CustomEvent('hide'))
  }
}

