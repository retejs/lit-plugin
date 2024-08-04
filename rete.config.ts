/* eslint-disable @typescript-eslint/naming-convention */
// import classProperties from '@babel/plugin-proposal-class-properties'
import decorators from '@babel/plugin-proposal-decorators'
import { ReteOptions } from 'rete-cli'

export default <ReteOptions>{
  input: 'src/index.tsx',
  name: 'LitPlugin',
  globals: {
    'rete': 'Rete',
    'rete-area-plugin': 'ReteAreaPlugin',
    'rete-render-utils': 'ReteRenderUtils',
    'lit': 'Lit',
    'lit/decorators.js': 'LitDecorators',
    'lit/directives/repeat.js': 'LitRepeat',
    'lit/directives/keyed.js': 'LitKeyed'
  },
  babel: {
    plugins: [
      [decorators, {
        version: '2023-05'
        // decoratorsBeforeExport: true
        // legacy: true
      }]
      // [classProperties, {
      //   // loose: true
      // }]
    ]
  }
}
