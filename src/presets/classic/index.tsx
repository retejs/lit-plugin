import { html, TemplateResult } from 'lit'
import { Scope } from 'rete'
import {
  classicConnectionPath, getDOMSocketPosition,
  loopConnectionPath, SocketPositionWatcher
} from 'rete-render-utils'

import { Requires } from '../..'
import { RefElement } from '../../ref'
import { Position } from '../../types'
import { RenderPreset } from '../types'
import { ConnectionElement } from './components/connection'
import { ConnectionWrapperElement } from './components/connection-wrapper'
import { ControlElement } from './components/control'
import { NodeElement } from './components/node'
import { SocketElement } from './components/socket'
import { ClassicScheme, ExtractPayload, LitArea2D, RenderEmit } from './types'

export type { ClassicScheme, LitArea2D, RenderEmit } from './types'

type CustomizationProps<Schemes extends ClassicScheme> = {
  node?: (data: ExtractPayload<Schemes, 'node'>) => ((props: { emit: RenderEmit<Schemes> }) => TemplateResult | null)
  connection?: (data: ExtractPayload<Schemes, 'connection'>) => ((props: {
    path: string
    start: Position
    end: Position
  }) => TemplateResult | null)
  socket?: (data: ExtractPayload<Schemes, 'socket'>) => (() => TemplateResult | null)
  control?: (data: ExtractPayload<Schemes, 'control'>) => () => (TemplateResult | null)
}
type OnChange = (data: Position) => void

type ClassicProps<Schemes extends ClassicScheme, K> = {
  socketPositionWatcher?: SocketPositionWatcher<Scope<never, [K]>>
  customize?: CustomizationProps<Schemes>
}

/**
 * Classic preset for rendering nodes, connections, controls and sockets.
 */
export function setup<Schemes extends ClassicScheme, K extends LitArea2D<Schemes>>(props?: ClassicProps<Schemes, K>): RenderPreset<Schemes, K> {
  const positionWatcher = typeof props?.socketPositionWatcher === 'undefined'
    ? getDOMSocketPosition<Schemes, K>()
    : props.socketPositionWatcher
  const { node, connection, socket, control } = props?.customize || {}

  customElements.define('rete-connection-wrapper', ConnectionWrapperElement)
  customElements.define('rete-connection', ConnectionElement)
  customElements.define('rete-ref', RefElement)
  customElements.define('rete-socket', SocketElement)
  customElements.define('rete-node', NodeElement)
  customElements.define('rete-control', ControlElement)

  return {
    attach(plugin) {
      positionWatcher.attach(plugin as unknown as Scope<never, [K]>)
    },
    update(context, plugin) {
      const { payload } = context.data
      const parent = plugin.parentScope()

      if (!parent) throw new Error('parent')
      const emit = parent.emit.bind(parent)

      if (context.data.type === 'node') {
        return { data: payload, emit }
      } else if (context.data.type === 'connection') {
        const { start, end } = context.data

        return {
          data: payload,
          ...start
            ? { start }
            : {},
          ...end
            ? { end }
            : {}
        }
      }
      return { data: payload }
    },
    // eslint-disable-next-line max-statements
    render(context, plugin) {
      if (context.data.type === 'node') {
        const parent = plugin.parentScope()
        const emit: RenderEmit<Schemes> = data => void parent.emit(data as K | Requires<Schemes>)

        return node
          ? node(context.data)({ emit })
          : html`<rete-node .data=${context.data.payload} .emit=${emit}></rete-node>`
      }
      if (context.data.type === 'connection') {
        const data = context.data
        const payload = data.payload
        const { sourceOutput, targetInput, source, target } = payload
        const component = (path: string, start: Position, end: Position) => {
          return connection
            ? connection(data)({ path, start, end })
            : html`<rete-connection .path=${path} .start=${start} .end=${end}></rete-connection>`
        }

        return html`<rete-connection-wrapper
          .start=${context.data.start || ((change: OnChange) => positionWatcher.listen(source, 'output', sourceOutput, change))}
          .end=${context.data.end || ((change: OnChange) => positionWatcher.listen(target, 'input', targetInput, change))}
          .path=${async (start: Position, end: Position) => {
            type FixImplicitAny = typeof plugin.__scope.produces | undefined
            const response: FixImplicitAny = await plugin.emit({
              type: 'connectionpath',
              data: {
                payload,
                points: [start, end]
              }
            })

            if (!response) return ''

            const { path, points } = response.data
            const curvature = 0.3

            if (!path && points.length !== 2) throw new Error('cannot render connection with a custom number of points')
            if (!path) return payload.isLoop
              ? loopConnectionPath(points as [Position, Position], curvature, 120)
              : classicConnectionPath(points as [Position, Position], curvature)

            return path
  }}
  .component=${component}
  ></rete-connection>`
      } else if (context.data.type === 'socket') {
        return socket
          ? socket(context.data)()
          : html`<rete-socket .data=${context.data.payload}></rete-socket>`
      } else if (context.data.type === 'control') {
        return control
          ? control(context.data)()
          : html`<rete-control .data=${context.data.payload}></rete-control>`
      }
      return null
    }
  }
}
