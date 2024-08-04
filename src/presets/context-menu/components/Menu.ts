import { css, html, LitElement } from 'lit'
import { property, state } from 'lit/decorators.js'

import { debounce } from '../utils/debounce'

export class Menu extends LitElement {
  @property({ type: Array }) accessor items: any[] = []
  @property({ type: Number }) accessor delay = 0
  @property({ type: Boolean }) accessor searchBar = false
  @property({ type: Function }) accessor onHide = () => null

  @state() accessor filter = ''
  hide

  static styles = css`
    .menu {
      padding: 10px
      width: var(--menu-width)
      margin-top: -20px
      margin-left: calc(-1 * var(--menu-width) / 2)
    }
  `

  constructor() {
    super()
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

  handleFilterChange(event: any) {
    this.filter = event.target.value
    // eslint-disable-next-line no-console
    console.log(event, this.filter)
    this.requestUpdate()
  }

  render() {
    return html`
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
          >
            ${item.label}
          </rete-context-menu-item>
        `)}
      </div>
    `
  }
}
