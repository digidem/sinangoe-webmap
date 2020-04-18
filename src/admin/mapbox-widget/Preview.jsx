import ReactMapboxGl, { ScaleControl } from 'react-mapbox-gl'
import React, { useState, useCallback } from 'react'

export default function Preview ({ value }) {
  const [layers, setLayers] = useState([])
  if (!value) return <div>Requires style url</div>

  function _onStyleLoad (map) {
    const style = map.getStyle()
    if (!style) setLayers([])
    if (style.layers) setLayers(style.layers)
  }

  const onStyleLoad = useCallback(_onStyleLoad, [])   

  return (
    <div>
      {layers.map((layer) => {
        console.log(layer)
        return <div>{layer.id}</div>
      })}
      <MapPreview style={value} onStyleLoad={onStyleLoad} />
    </div>
  )
}

const MapPreview = React.memo(function ({ style, onStyleLoad }) {
  // Netlify-CMS Preview elements are rendered in an iframe
  // This hacks in the mapbox-gl css, because simply importing it 
  // in this file will not work 
  const iframe = document.querySelector('iframe')
  const head = iframe.contentDocument.documentElement.querySelector('head')
  const link = document.createElement('link')
  link.setAttribute('href', 'https://api.mapbox.com/mapbox-gl-js/v1.9.1/mapbox-gl.css')
  link.setAttribute('rel', 'stylesheet')
  head.appendChild(link)

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
      <ScaleControl position={'top-right'} />
    </Map>
  )
})
