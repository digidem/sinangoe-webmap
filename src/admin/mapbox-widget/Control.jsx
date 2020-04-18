import PropTypes from 'prop-types'
import { fromJS } from 'immutable'
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
  handleChange (obj) {
    this.props.onChange(fromJS(obj))
  }

  render () {
    const {
      forID,
      value,
      classNameWrapper
    } = this.props

    var values = value.toJS()
    return (
      <div>
        <input
          type='text'
          id={forID}
          placeholder='Access Token'
          className={classNameWrapper}
          value={values.accessToken}
          onChange={e => this.handleChange({ accessToken: e.target.value })}
        />
        <input
          type='text'
          id={forID}
          placeholder='Style'
          className={classNameWrapper}
          value={values.style}
          onChange={e => this.handleChange({ style: e.target.value })}
        />
      </div>
    )
  }
}

Control.defaultProps = defaultProps
Control.propTypes = propTypes

export default Control
