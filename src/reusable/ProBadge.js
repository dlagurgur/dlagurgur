import React from 'react'
import { CBadge } from '@coreui/react'
import PropTypes from 'prop-types'

const ProBadge = props => {
  let { children, ...attributes } = { ...props }
  return (
    <CBadge
      href="https://coreui.io/pro/react/"
      color="danger"
      target="_blank"
      rel="noreferrer noopener"
      {...attributes}
    >
      {children ? children : 'CoreUI Pro Component'}
    </CBadge>
  )
}

ProBadge.propTypes = {
  children: PropTypes.node
}

export default React.memo(ProBadge)
