/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveEndForward()
}

export const input = (
  <value>
    
      <block>
        one two t<cursor />hree
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        one two t<anchor />h<focus />ree
      </block>
    
  </value>
)