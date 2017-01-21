/*
  Process Connect
    - Connects a Component to a Process to receive its data as props
*/
import React from 'react'
import { getRecord, getRecords } from './registry'

const statics = (selected, connector, config = {}) => WrappedComponent => props => {
  const Component = connector(getRecords(selected, config) || {})(WrappedComponent)
  return <Component {...props} />
}

export default statics