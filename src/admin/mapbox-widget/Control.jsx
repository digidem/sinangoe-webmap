import PropTypes from 'prop-types'
import React from 'react'

var propTypes = {
  onChange: PropTypes.func.isRequired,
  forID: PropTypes.string,
  value: PropTypes.node,
  classNameWrapper: PropTypes.string.isRequired
}

var defaultProps = {
  value: ''
}

class Control extends React.Component {
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
