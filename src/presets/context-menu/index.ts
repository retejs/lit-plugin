import { html } from 'lit'
import { BaseSchemes } from 'rete'

import { RenderPreset } from '../types'
import { Block } from './components/Block'
import { Item } from './components/Item'
import { Menu } from './components/Menu'
import { Search } from './components/Search'
import { ContextMenuRender } from './types'

/**
 * Preset for rendering context menu.
 */
export function setup<Schemes extends BaseSchemes, K extends ContextMenuRender>(props?: { delay?: number }): RenderPreset<Schemes, K> {
  const delay = typeof props?.delay === 'undefined' ? 1000 : props.delay

  customElements.define('rete-context-menu', Menu)
  customElements.define('rete-context-menu-block', Block)
  customElements.define('rete-context-menu-search', Search)
  customElements.define('rete-context-menu-item', Item)

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
