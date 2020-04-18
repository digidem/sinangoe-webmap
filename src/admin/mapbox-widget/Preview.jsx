import PropTypes from 'prop-types'
import React from 'react'

function Preview ({ value }) {
  console.log(value)
  if (!value || !value.layers) return <div></div>
  return (
    <div>
      {value.layers && value.layers.map((layer) => {
        return <div>{layer.id}</div>
      })}
    </div>
  )
}

Preview.propTypes = {
  value: PropTypes.any
}
export default Preview
