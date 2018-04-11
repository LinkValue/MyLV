import React from 'react'
import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'

import { App } from '../app.container'

jest.unmock('../app.container')

describe('App', () => {
  let props

  beforeEach(() => {
    props = {
      classes: {},
      shouldDisplayProofOfTransportDialog: true,
      hasInvalidTransportProof: false,
      isConnected: true,
      toggleProofOfTransportDialog: jest.fn(),
    }
  })

  const getWrapper = () => shallow(<App {...props}>Foo</App>)

  it('should render properly', () => {
    // When
    const wrapper = getWrapper()

    // Then
    expect(shallowToJson(wrapper)).toMatchSnapshot()
  })

  it('should handle app drawer opening', () => {
    // Given
    const wrapper = getWrapper()

    // When
    const appBar = wrapper.find('Connect(WithStyles(AppBar))')
    appBar.prop('onDrawerOpen')()
    wrapper.update()

    // Then
    expect(shallowToJson(wrapper)).toMatchSnapshot()
  })
})