import PropTypes from 'prop-types'
import React from 'react'
import mapboxgl from 'mapbox-gl'

var propTypes = {
  onChange: PropTypes.func.isRequired,
  forID: PropTypes.string,
  value: PropTypes.node,
  classNameWrapper: PropTypes.string.isRequired
}

var defaultProps = {
  value: ''
}
mapboxgl.accessToken = 'pk.eyJ1IjoiYWxpeWEiLCJhIjoiY2lzZDVhbjM2MDAwcTJ1cGY4YTN6YmY4cSJ9.NxK9jMmYZsA32ol_IZGs5g'

class Control extends React.Component {
  componentWillMount () {
  }

  render () {
    const {
      forID,
      value,
      onChange,
      classNameWrapper
    } = this.props

    return (
      <div>
        <input
          type='text'
          id={forID}
          placeholder='StyleURL'
          className={classNameWrapper}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
        />
      </div>
    )
  }
}

Control.defaultProps = defaultProps
Control.propTypes = propTypes

export default Control
