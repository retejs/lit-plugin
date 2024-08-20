import { css, html, LitElement } from 'lit'
import { property, state } from 'lit/decorators.js'

import { Item } from '../types'
import { debounce } from '../utils/debounce'

export class MenuElement extends LitElement {
  @property({ type: Array }) accessor items: Item[] = []
  @property({ type: Number }) accessor delay = 0
  @property({ type: Boolean }) accessor searchBar = false
  @property({ type: Function }) accessor onHide = () => null

  @state() accessor filter = ''
  hide!: ReturnType<typeof debounce>

  static styles = css`
    .menu {
      padding: 10px;
      width: var(--menu-width);
      margin-top: -20px;
      margin-left: calc(-1 * var(--menu-width) / 2);
    }
  `

  connectedCallback(): void {
    super.connectedCallback()
    this.hide = debounce(this.delay, this.onHide)
  }

  firstUpdated() {
    this.addEventListener('mouseover', () => this.hide.cancel())
    this.addEventListener('mouseleave', () => this.hide.call())
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    if (this.hide) this.hide.cancel()
  }

  getItems() {
    const filterRegexp = new RegExp(this.filter, 'i')

    return this.items.filter(item => item.label.match(filterRegexp))
  }

  handleFilterChange(event: InputEvent) {
    this.filter = (event.target as HTMLInputElement).value
    this.requestUpdate()
  }

  render() {
    return html`
      <style>
        :host {
          --context-color: rgba(110, 136, 255, 0.8);
          --context-color-light: rgba(130, 153, 255, 0.8);
          --context-color-dark: rgba(69, 103, 255, 0.8);
          --context-menu-round: 5px;
          --menu-width: 120px;
        }
      </style>
      <div class="menu" data-testid="context-menu">
        ${this.searchBar
    ? html`<rete-context-menu-block>
                 <rete-context-menu-search .text=${this.filter} @change=${this.handleFilterChange} />
            </rete-context-menu-block>`

    : ''}
        ${this.getItems().map(item => html`
          <rete-context-menu-item
            .key=${item.key}
            @select=${item.handler}
            .delay=${this.delay}
            @hide=${this.onHide}
            .subitems=${item.subitems}
            class="first"
          >
            ${item.label}
          </rete-context-menu-item>
        `)}
      </div>
    `
  }
}
