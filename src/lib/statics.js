/*
  Process Connect
    - Connects a Component to a Process to receive its data as props
*/
import React from 'react'
import { getRecord, getRecords } from './registry'

export default (selected, connector, config = {}) => {
  return connector(getRecords(selected, config) || {})
}
