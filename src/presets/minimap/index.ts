import { BaseSchemes } from 'rete'

import { RenderPreset } from '../types'
import { Minimap } from './components/Minimap'
import { MiniNode } from './components/MiniNode'
import { MiniViewport } from './components/MiniViewport'
import { MinimapRender } from './types'
import { html } from 'lit'

/**
 * Preset for rendering minimap.
 */
export function setup<Schemes extends BaseSchemes, K extends MinimapRender>(props?: { size?: number }): RenderPreset<Schemes, K> {
  customElements.define('rete-minimap', Minimap)
  customElements.define('rete-mini-node', MiniNode)
  customElements.define('rete-mini-viewport', MiniViewport)

  return {
    update(context) {
      if (context.data.type === 'minimap') {
        return {
          nodes: context.data.nodes,
          size: props?.size || 200,
          ratio: context.data.ratio,
          viewport: context.data.viewport,
          translate: context.data.translate,
          point: context.data.point
        }
      }
    },
    render(context) {
      if (context.data.type === 'minimap') {
        return html`
        <rete-minimap
            .nodes="${context.data.nodes}"
            .size="${props?.size || 200}"
            .ratio="${context.data.ratio}"
            .viewport="${context.data.viewport}"
            .translate="${context.data.translate}"
            .point="${context.data.point}"
        ></rete-minimap>
        `
      }
    }
  }
}
