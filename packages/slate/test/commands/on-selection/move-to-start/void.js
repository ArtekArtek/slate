/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveToStart()
}

export const input = (
  <value>
    
      <image>
        <anchor /> <focus />
      </image>
    
  </value>
)

export const output = (
  <value>
    
      <image>
        <cursor />{' '}
      </image>
    
  </value>
)