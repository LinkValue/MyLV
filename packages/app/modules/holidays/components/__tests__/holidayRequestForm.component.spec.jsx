import React from 'react'
import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'
import { getDaysForLabel } from '@cracra/shared/holidays.utils'

import { HolidayRequestForm } from '../holidayRequestForm.component'

jest.unmock('../holidayRequestForm.component')

describe('HolidayRequestForm', () => {
  let props

  const getWrapper = () => shallow(<HolidayRequestForm {...props} />)

  beforeEach(() => {
    props = {
      handleSubmit: jest.fn(),
      valid: true,
      pristine: true,
      render: jest.fn(({ children }) => <div>{children}</div>),
    }
  })

  it('should render properly', () => {
    // Given
    getDaysForLabel.mockImplementation((periods, key) => `${key}${periods.length}`)

    // When
    const wrapper = getWrapper()

    // Then
    expect(shallowToJson(wrapper)).toMatchSnapshot()
  })
})
