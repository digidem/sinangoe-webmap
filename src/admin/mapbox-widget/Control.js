import PropTypes from 'prop-types';
import React from 'react';

var propTypes = {
  onChange: PropTypes.func.isRequired,
  forID: PropTypes.string,
  value: PropTypes.node,
  classNameWrapper: PropTypes.string.isRequired,
}

var defaultProps = {
  value: '',
}

class Control extends React.Component {

  handleChange (content) {
    const { onChange } = this.props
    onChange(content)
  }

  render() {
    const {
      forID,
      value,
      onChange,
      classNameWrapper,
    } = this.props;

    return (
      <div>
        <input
          type="text"
          id={forID}
          placeholder="Access Token"
          className={classNameWrapper}
          value={value || ''}
          onChange={e => this.handleChange({accessToken: e.target.value})}
        />
        <input
          type="text"
          id={forID}
          placeholder="Style"
          className={classNameWrapper}
          value={value || ''}
          onChange={e => this.handleChange({style: e.target.value})}
        />
      <div>
    );
  }
}

Control.defaultProps = defaultProps
Control.propTypes = propTypes

export default Control
