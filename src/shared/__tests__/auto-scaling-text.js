import React from 'react'
import {render} from '@testing-library/react'
import AutoScalingText from 'shared/auto-scaling-text'

test('renders AutoScalingText', () => {
  const {debug} = render(<AutoScalingText />)
  console.log(debug())
})
