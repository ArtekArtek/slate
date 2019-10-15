/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveToStartOfDocument()
}

export const input = (
  <value>
    
      <block>one</block>
      <block>
        <cursor />two
      </block>
      <block>three</block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <cursor />one
      </block>
      <block>two</block>
      <block>three</block>
    
  </value>
)