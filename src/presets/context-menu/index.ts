import { html } from 'lit'
import { BaseSchemes } from 'rete'

import { RenderPreset } from '../types'
import { BlockElement } from './components/Block'
import { ItemElement } from './components/Item'
import { MenuElement } from './components/Menu'
import { SearchElement } from './components/Search'
import { ContextMenuRender } from './types'

customElements.define('rete-context-menu', MenuElement)
customElements.define('rete-context-menu-block', BlockElement)
customElements.define('rete-context-menu-search', SearchElement)
customElements.define('rete-context-menu-item', ItemElement)

/**
 * Preset for rendering context menu.
 */
export function setup<Schemes extends BaseSchemes, K extends ContextMenuRender>(props?: { delay?: number }): RenderPreset<Schemes, K> {
  const delay = typeof props?.delay === 'undefined'
    ? 1000
    : props.delay

  return {
    update(context) {
      if (context.data.type === 'contextmenu') {
        return {
          items: context.data.items,
          delay,
          searchBar: context.data.searchBar,
          onHide: context.data.onHide
        }
      }
    },
    render(context) {
      if (context.data.type === 'contextmenu') {
        return html`
            <rete-context-menu
                .items="${context.data.items}"
                .delay="${delay}"
                .searchBar="${context.data.searchBar}"
                .onHide="${context.data.onHide}"
            ></rete-context-menu>
        `
      }
    }
  }
}
