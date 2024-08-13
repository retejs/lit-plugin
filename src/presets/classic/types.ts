import { ClassicPreset as Classic, GetSchemes, NodeId } from 'rete'

import { Position, RenderSignal } from '../../types'

export type ClassicScheme = GetSchemes<Classic.Node, Classic.Connection<Classic.Node, Classic.Node> & { isLoop?: boolean }>

export type Side = 'input' | 'output'

export type LitArea2D<T extends ClassicScheme> =
  | RenderSignal<'node', { payload: T['Node'] }>
  | RenderSignal<'connection', { payload: T['Connection'], start?: Position, end?: Position }>
  | RenderSignal<'socket', {
    payload: any // GetSockets<T['Node']>
    nodeId: NodeId
    side: Side
    key: string
  }>
  | RenderSignal<'control', {
    payload: any // GetControls<T['Node']>
  }>
  | { type: 'unmount', data: { element: HTMLElement } }

export type RenderEmit<T extends ClassicScheme> = (props: LitArea2D<T>) => void

export type ExtractPayload<T extends ClassicScheme, K extends string> = Extract<LitArea2D<T>, { type: 'render', data: { type: K }}>['data']
