/*
  Process Connect
    - Connects a Component to a Process to receive its data as props

    export default statics(
      {
        dashboard: ['actions', 'selectors']
      },
      ({ selectors, actions }) => (
        connect(
          state => ({
            grid: selectors.grid(state)
          }),
          actions
        )(DashboardGrid)
      ),
      { prefixed: false }
    )
*/
import React from 'react'
import { getRecord, getRecords } from './registry'

export default (selected, connector, config = {}) => {
  return connector(getRecords(selected, config) || {})
}
