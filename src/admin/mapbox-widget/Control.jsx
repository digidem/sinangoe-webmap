import PropTypes from 'prop-types'
import ReactMapboxGl from 'react-mapbox-gl'
import React, { useCallback, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { fromJS } from 'immutable'

var propTypes = {
  onChange: PropTypes.func.isRequired,
  forID: PropTypes.string,
  value: PropTypes.any,
  classNameWrapper: PropTypes.string.isRequired
}

var defaultProps = {
  value: {
    style: '',
    layers: []
  }
}
mapboxgl.accessToken = 'pk.eyJ1IjoiYWxpeWEiLCJhIjoiY2lzZDVhbjM2MDAwcTJ1cGY4YTN6YmY4cSJ9.NxK9jMmYZsA32ol_IZGs5g'

function Control ({ forID, value, onChange, classNameWrapper }) {
  const [ styleURL, setStyle ] = useState(value.style)

  function _onStyleLoad (map) {
    const _style = map.getStyle()
    if (!_style) onChange(fromJS({ style: styleURL, layers: [] }))
    if (_style.layers) {
      var val = fromJS({ style: styleURL, layers: _style.layers })
      onChange(val)
      console.log('onChange', val)
    }
  }

  const onStyleLoad = useCallback(_onStyleLoad, [styleURL])   

  return (
    <div>
      <input
        type='text'
        id={forID}
        placeholder='StyleURL'
        className={classNameWrapper}
        value={styleURL || ''}
        onChange={e => setStyle(e.target.value)}
      />
      {styleURL && <MapPreview style={styleURL} onStyleLoad={onStyleLoad} />}
    </div>
  )
}

Control.defaultProps = defaultProps
Control.propTypes = propTypes

export default Control

const MapPreview = React.memo(function ({ style, onStyleLoad }) {
  // Netlify-CMS Preview elements are rendered in an iframe
  // This hacks in the mapbox-gl css, because simply importing 
  // in this file will not work 
  // const iframe = document.querySelector('iframe')
  // const head = iframe.contentDocument.documentElement.querySelector('head')
  // const link = document.createElement('link')
  // link.setAttribute('href', 'https://api.mapbox.com/mapbox-gl-js/v1.9.1/mapbox-gl.css')
  // link.setAttribute('rel', 'stylesheet')
  // head.appendChild(link)

  const Map = ReactMapboxGl({
    accessToken:
      'pk.eyJ1IjoiYWxpeWEiLCJhIjoiY2lzZDVhbjM2MDAwcTJ1cGY4YTN6YmY4cSJ9.NxK9jMmYZsA32ol_IZGs5g',
    hash: false,
    doubleClickZoom: false,
    logoPosition: 'bottom-right'
  })

  var defaultCenter = [-79.656232, -0.489971]

  return (
    <Map onStyleLoad={onStyleLoad}
      center={defaultCenter}
      zoom={[6]}
      style={style}
      containerStyle={{
        height: '0',
        width: '0'
      }}>
    </Map>
  )
})
