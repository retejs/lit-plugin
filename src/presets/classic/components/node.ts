import { css, html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'

import { ClassicScheme, RenderEmit } from '../types'

type NodeExtraData = { width?: number, height?: number }

export class NodeElement<S extends ClassicScheme> extends LitElement {
  @property({ type: Number }) accessor width: number | null = null
  @property({ type: Number }) accessor height: number | null = null
  @property({ type: Object }) accessor data!: ClassicScheme['Node'] & NodeExtraData
  @property({ type: Function }) accessor styles: ((props: any) => any) | null = null
  @property({ type: Function }) accessor emit: RenderEmit<S> | null = null

  static styles = css`
    :host {
      --node-color: rgba(110, 136, 255, 0.8);
      --node-color-hover: rgba(130, 153, 255, 0.8);
      --node-color-selected: #ffd92c;
      --socket-size: 24px;
      --socket-margin: 6px;
      --socket-color: #96b38a;
      --node-width: 180px;
    }

    :host {
      display: block;
      background: var(--node-color);
      border: 2px solid #4e58bf;
      border-radius: 10px;
      cursor: pointer;
      box-sizing: border-box;
      padding-bottom: 6px;
      position: relative;
      user-select: none;
      line-height: initial;
      font-family: Arial;
    }

    :host(:hover) {
      background: var(--node-color-hover);
    }

    :host(.selected) {
      background: var(--node-color-selected);
      border-color: #e3c000;
    }

    .title {
      color: white;
      font-family: sans-serif;
      font-size: 18px;
      padding: 8px;
    }

    .output,
    .input {
      text-align: right;
    }

    .input {
      text-align: left;
    }


    .output-socket {
      text-align: right;
      margin-right: calc(0px - var(--socket-size) / 2 - var(--socket-margin));
      display: inline-block;
    }
    .input-socket {
        text-align: left;
        margin-left: calc(0px - var(--socket-size) / 2 - var(--socket-margin));
        display: inline-block;
    }

    .input-title,
    .output-title {
      vertical-align: middle;
      color: white;
      display: inline-block;
      font-family: sans-serif;
      font-size: 14px;
      margin: var(--socket-margin);
      line-height: var(--socket-size);
    }

    .input-control {
      z-index: 1;
      width: calc(100% - calc(var(--socket-size) + 2 * var(--socket-margin)));
      vertical-align: middle;
      display: inline-block;
    }

    .control {
      display: block;
      padding: var(--socket-margin) calc(var(--socket-size) / 2 + var(--socket-margin));
    }
  `

  sortByIndex<T extends [string, undefined | { index?: number }][]>(entries: T) {
    entries.sort((a, b) => {
      const ai = a[1]?.index || 0
      const bi = b[1]?.index || 0

      return ai - bi
    })
  }

  render() {
    const inputs = Object.entries(this.data.inputs || {})
    const outputs = Object.entries(this.data.outputs || {})
    const controls = Object.entries(this.data.controls || {})
    const { id, label, width, height } = this.data

    this.sortByIndex(inputs)
    this.sortByIndex(outputs)
    this.sortByIndex(controls)

    if (this.data.selected) {
      this.classList.add('selected')
    } else {
      this.classList.remove('selected')
    }

    return html`
      <style>
        :host {
          width: ${Number.isFinite(width) ? `${width}px` : 'var(--node-width)'};
          height: ${Number.isFinite(height) ? `${height}px` : 'auto'};
        }
        ${this.styles && this.styles(this)}
      </style>
      <div class="title">${label}</div>
      ${outputs.map(([key, output]) => output ? html`
        <div class="output" key=${key}>
          <div class="output-title">${output?.label}</div>
          <span class="output-socket" data-testid="output-socket">
            <rete-ref
              .data=${{ type: 'socket', side: 'output', key, nodeId: id, payload: output.socket }}
              .emit=${this.emit}
            ></rete-ref>
          </span>
        </div>` : null)}
      ${controls.map(([key, control]) => control ? html`
        <span class="control" data-testid="${'control-'+key}">
          <rete-ref
            .emit=${this.emit}
            .data="${{ type: 'control', payload: control }}"
          ></rete-ref>
        </span>
        ` : null)}
      ${inputs.map(([key, input]) => input ? html`
        <div class="input" key=${key}>
          <span class="input-socket" data-testid="input-socket">
            <rete-ref
              .data=${{ type: 'socket', side: 'input', key, nodeId: id, payload: input.socket }}
              .emit=${this.emit}
            ></rete-ref>
          </span>
          ${input && (!input.control || !input.showControl) ? html`
            <div class="input-title">${input?.label}</div>` : null}
          ${input?.control && input?.showControl ? html`
            <span class="control" data-testid="input-control">
              <rete-ref
                .emit=${this.emit}
                .data="${{ type: 'control', payload: input.control }}"
              ></rete-ref>
            </span>
          ` : null}
        </div>` : null)}
    `
  }
}
