/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { html } from 'lit'
import { Scope } from 'rete'
import {
  classicConnectionPath, getDOMSocketPosition,
  loopConnectionPath, SocketPositionWatcher
} from 'rete-render-utils'

import { Position } from '../../types'
import { RenderPreset } from '../types'
import { ConnectionElement } from './components/connection'
import { NodeElement } from './components/node'
import { SocketElement } from './components/socket'
import { RefElement } from './refs/ref'
import { ClassicScheme, LitArea2D, RenderEmit } from './types'

export type { ClassicScheme, LitArea2D, RenderEmit } from './types'

type ExtractPayload<T, N> = any | T | N
type AcceptComponent<T, P = any> = any | T | P

type CustomizationProps<Schemes extends ClassicScheme> = {
  node?: (data: ExtractPayload<Schemes, 'node'>) => AcceptComponent<typeof data['payload'], { emit: RenderEmit<Schemes> }> | null
  connection?: (data: ExtractPayload<Schemes, 'connection'>) => AcceptComponent<typeof data['payload']> | null
  socket?: (data: ExtractPayload<Schemes, 'socket'>) => AcceptComponent<typeof data['payload']> | null
  control?: (data: ExtractPayload<Schemes, 'control'>) => AcceptComponent<typeof data['payload']> | null
}

type ClassicProps<Schemes extends ClassicScheme, K> = {
  socketPositionWatcher?: SocketPositionWatcher<Scope<never, [K]>>
  customize?: CustomizationProps<Schemes>
}

/**
 * Classic preset for rendering nodes, connections, controls and sockets.
 */
export function setup<Schemes extends ClassicScheme, K extends LitArea2D<Schemes>>(
  props?: ClassicProps<Schemes, K>
): RenderPreset<Schemes, K> {
  const positionWatcher = typeof props?.socketPositionWatcher === 'undefined'
    ? getDOMSocketPosition<Schemes, K>()
    : props?.socketPositionWatcher
  // const { node, connection, socket, control } = props?.customize || {}

  customElements.define('rete-connection', ConnectionElement)
  customElements.define('rete-ref', RefElement)
  customElements.define('rete-socket', SocketElement)
  customElements.define('rete-node', NodeElement)

  return {
    attach(plugin) {
      positionWatcher.attach(plugin as unknown as Scope<never, [K]>)
    },
    render(context, plugin) {
      if (context.data.type === 'node') {
        const parent = plugin.parentScope()

        return html`<rete-node .data=${context.data.payload} .emit=${(data: any) => parent.emit(data)}></rete-node>`
      }
      if (context.data.type === 'connection') {
        const payload = context.data.payload
        const { sourceOutput, targetInput, source, target } = payload

        return html`<rete-connection
          .start=${context.data.start || ((change: any) => positionWatcher.listen(source, 'output', sourceOutput, change))}
          .end=${context.data.end || ((change: any) => positionWatcher.listen(target, 'input', targetInput, change))}
          .path=${async (start: any, end: any) => {
            type FixImplicitAny = typeof plugin.__scope.produces | undefined
            const response: FixImplicitAny = await plugin.emit({
              type: 'connectionpath', data: {
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
  }}></rete-connection>`
      }
      if (context.data.type === 'socket' as any) {
        return html`<rete-socket .data=${context.data.payload}></rete-socket>`
      }
      return null
      // if (context.data.type === 'node') {
      //   const parent = plugin.parentScope()
      //   const Component = (node ? node(context.data) : Node) as typeof Node

      //   return (Component &&
      //     <Component
      //       data={context.data.payload}
      //       emit={data => parent.emit(data as any)}
      //     />
      //   )
      // } else if (context.data.type === 'connection') {
      //   const Component = (connection ? connection(context.data) : Connection) as typeof Connection
      //   const payload = context.data.payload
      //   const { sourceOutput, targetInput, source, target } = payload

      //   return (Component &&
      //     <ConnectionWrapper
      //       start={context.data.start || (change => positionWatcher.listen(source, 'output', sourceOutput, change))}
      //       end={context.data.end || (change => positionWatcher.listen(target, 'input', targetInput, change))}
      //       path={async (start, end) => {
      //         type FixImplicitAny = typeof plugin.__scope.produces | undefined
      //         const response: FixImplicitAny = await plugin.emit({
      //           type: 'connectionpath', data: {
      //             payload,
      //             points: [start, end]
      //           }
      //         })

      //         if (!response) return ''

      //         const { path, points } = response.data
      //         const curvature = 0.3

      //         if (!path && points.length !== 2) throw new Error('cannot render connection with a custom number of points')
      //         if (!path) return payload.isLoop
      //           ? loopConnectionPath(points as [Position, Position], curvature, 120)
      //           : classicConnectionPath(points as [Position, Position], curvature)

      //         return path
      //       }}
      //     >
      //       <Component data={context.data.payload} />
      //     </ConnectionWrapper>
      //   )
      // } else if (context.data.type === 'socket') {
      //   const Component = (socket ? socket(context.data) : Socket) as typeof Socket

      //   return (Component && context.data.payload && <Component data={context.data.payload} />
      //   )
      // } else if (context.data.type === 'control') {
      //   const Component = control && context.data.payload
      //     ? control(context.data)
      //     : (
      //       context.data.payload instanceof ClassicPreset.InputControl
      //         ? Control
      //         : null
      //     )

      //   return Component && <Component data={context.data.payload as any} />
      // }
    }
  }
}
