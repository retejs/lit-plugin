import { css, html, LitElement } from 'lit'
import { property, state } from 'lit/decorators.js'

import { debounce } from '../utils/debounce'

export class Item extends LitElement {
  @property({ type: Array }) accessor subitems: any[] = []
  @property({ type: Number }) accessor delay = 0

  @state() accessor visibleSubitems = false

  hide: any

  static styles = css`
    .block {
      padding: 0
    }
    .content {
      padding: 4px
    }
    .hasSubitems:after {
      content: '►'
      position: absolute
      opacity: 0.6
      right: 5px
      top: 5px
    }
    .subitems {
      position: absolute
      top: 0
      left: 100%
      width: var(--width)
    }
  `

  constructor() {
    super()
    this.hide = debounce(this.delay, this.hideSubitems.bind(this))
  }

  hideSubitems() {
    this.visibleSubitems = false
  }

  render() {
    return html`
      <div class="block ${this.subitems?.length ? 'hasSubitems' : ''}" data-testid="context-menu-item">
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
                      <item-component
                        .key="${item.key}"
                        .delay="${this.delay}"
                        .subitems="${item.subitems}"
                        @select="${item.handler}"
                        @hide="${this.handleHide}"
                      >
                        ${item.label}
                      </item-component>
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
    this.hide()
  }

  handleHide() {
    this.dispatchEvent(new CustomEvent('hide'))
  }
}

