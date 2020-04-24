import * as React from 'react'
import Select from 'react-select'
import { fromJS, Set } from 'immutable'
import { reactSelectStyles } from 'netlify-cms-ui-default/dist/esm/styles'
import Mapbox from '@mapbox/mapbox-sdk/services/styles'
import url from 'url'

const ACCESS_TOKEN = require('../../../mapbox-config.js').accessToken

export class Control extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      options: []
    }
  }

  async componentDidMount () {
    const { loadEntry, field } = this.props

    const collection = field.get('collection')
    const file = field.get('file')
    const targetField = field.get('target_field')
    const fieldId = field.get('id_field')
    const fieldDisplay = field.get('display_fields') || fieldId

    const mapbox = await loadEntry(collection, file)
    console.log('mapboxStyleURL', mapbox)
    const styleURL = mapbox.data[targetField]

    getMapboxStyle(styleURL, (err, style) => {
      // TODO: show user the error
      if (err) console.error(err)
      const layers = style.layers
      console.log('layers', layers)

      const options = layers.map(option => {
        let value, label

        if (typeof option === 'string') {
          value = label = option
        } else {
          value = option[fieldId]
          label = option[fieldDisplay]
        }

        return { value, label }
      })
      this.setState({ options })
    })
  }

  changeHandle (selected) {
    const { onChange } = this.props
    if (!selected) onChange([])
    const value = Array.isArray(selected)
      ? selected
      : [ selected ]
    onChange(fromJS(value))
  }

  getSelectedValue (value, options) {
    let selected = []
    if (!value) return selected
    else if (typeof value === 'string') {
      const maybeOption = options.find(option => option.value === value)
      selected = maybeOption ? [maybeOption] : []
    }
    else selected = value.toJS()
    return selected
  }

  render () {
    const {
      field,
      value,
      forID,
      classNameWrapper,
      setActiveStyle,
      setInactiveStyle
    } = this.props
    const { options } = this.state
    const selected = this.getSelectedValue(value, options)

    const isMultiple = field.get('multiple')
    const placeholder = field.get('placeholder') || 'select...'

    return (
      <div>
        <Select
          inputId={forID}
          isMulti={isMultiple}
          onChange={this.changeHandle.bind(this)}
          className={classNameWrapper}
          onFocus={setActiveStyle}
          onBlur={setInactiveStyle}
          styles={reactSelectStyles}
          name="categories"
          isClearable={false}
          value={selected}
          options={options}
          placeholder={placeholder}
        />
      </div>
    )
  }
}

// TODO: get access token from field
var client = new Mapbox({ accessToken: ACCESS_TOKEN })

function getMapboxStyle (styleURL, cb) {
  // TODO: sad. this is necessary cause path.parse is not in path-browserify
  // https://github.com/webpack/node-libs-browser/pull/79
  var parts = url.parse(styleURL).pathname.split('/')
  var styleId = parts[parts.length - 1]

  client.getStyle({styleId})
    .send()
    .then((resp) => {
      const style = resp.body
      return cb(null, style)
    })
    .catch(cb)
}
