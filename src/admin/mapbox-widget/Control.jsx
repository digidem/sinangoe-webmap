import { createPortal } from 'react-dom'
import ReactMapboxGl from 'react-mapbox-gl'
import React, { useCallback, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { fromJS } from 'immutable'

var defaultProps = {
  value: {
    style: '',
    layers: []
  }
}

export const renderDefaultControl = ({ value, field }) => {
  return '<div> hi</div>'
}

export const PreviewPortal = ({portalRef, children}) => 
  portalRef && portalRef.current && createPortal(children, portalRef.current)

export const createControl = ({
  renderControl,
  renderPreview,
  previewRef
}) => {
  class Control extends React.Component {
    render () {
      return <InnerControl {...this.props} />
    }
  }
  function InnerControl ({ forID, value, onChange, classNameWrapper }) {
    const data = value.toJS()
    const [ styleURL, setStyle ] = useState(data.styleURL)
    const [ layers, setLayers ] = useState(data.layers)

    function _onStyleLoad (map) {
      const _style = map.getStyle()
      let val
      if (!_style) val = { styleURL, layers: [] }
      if (_style.layers) val = { styleURL, layers: _style.layers }

      onChange(fromJS(val))
      setLayers(val.layers)
    }
    
    const noValue = (typeof value === 'undefined' || value.styleURL === '')
    console.log('novalue', noValue)

    const onStyleLoad = useCallback(_onStyleLoad, [styleURL]) 
    console.log('RENDERING', value.toJS())


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
        
        { /* Renders preview in splitpane via this component... */ }
        <PreviewPortal portalRef={previewRef}>
          {!noValue && renderPreview({value}) }
        </PreviewPortal>
      </div>
    )
  }

  Control.defaultProps = defaultProps
  return Control
}

mapboxgl.accessToken = 'pk.eyJ1IjoiYWxpeWEiLCJhIjoiY2lzZDVhbjM2MDAwcTJ1cGY4YTN6YmY4cSJ9.NxK9jMmYZsA32ol_IZGs5g'

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
