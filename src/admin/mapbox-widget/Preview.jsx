import PropTypes from 'prop-types'
import ReactMapboxGl, { ScaleControl } from 'react-mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import * as React from 'react'

export default function Preview ({ value }) {
  if (!value) return <div>Requires style url</div>
  var defaultCenter = [ -79.656232, -0.489971 ]

  const Map = ReactMapboxGl({
    accessToken: 'pk.eyJ1IjoiYWxpeWEiLCJhIjoiY2lzZDVhbjM2MDAwcTJ1cGY4YTN6YmY4cSJ9.NxK9jMmYZsA32ol_IZGs5g',
    hash: false,
    doubleClickZoom: false,
    logoPosition: 'bottom-right'
  })

  return (
    <Map
      center={defaultCenter}
      zoom={[6]}
      style={value}
      containerStyle={{
        height: '100vh',
        width: '100vw'
      }}>
      <ScaleControl position={'top-right'} />

    </Map>
  )
}

Preview.propTypes = {
  value: PropTypes.node
}
