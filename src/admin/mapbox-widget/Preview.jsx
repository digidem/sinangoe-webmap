import PropTypes from 'prop-types'
import ReactMapboxGl, { ScaleControl } from 'react-mapbox-gl'
import * as React from 'react'

export default function Preview ({ value }) {
  console.log(arguments)
  if (!value) return <div>Requires access token and style url</div>
  var { accessToken, style } = value.toJS()
  if (!accessToken || !style) {
    return <div>Requires access token and style url</div>
  }
  var defaultCenter = [ -79.656232, -0.489971 ]

  const Map = ReactMapboxGl({
    accessToken: accessToken,
    interactive: false,
    attributionControl: false,
    scrollZoom: false,
    zoomControl: false,
    boxZoom: false,
    hash: false,
    doubleClickZoom: false,
    logoPosition: 'bottom-right'
  })

  return (
    <Map
      center={defaultCenter}
      zoom={[6]}
      style={style}
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
