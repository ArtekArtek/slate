/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveAnchorBackward(3)
}

export const input = (
  <value>
    
      <block>
        one <anchor />tw<focus />o three
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        o<anchor />ne tw<focus />o three
      </block>
    
  </value>
)