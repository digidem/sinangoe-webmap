import * as React from 'react'
import { renderDefaultControl, createControl } from './Control'
import { renderDefaultPreview, createPreview } from './Preview'

const createWidget = ({
  renderControl = renderDefaultControl,
  renderPreview = renderDefaultPreview,
  name = 'mapbox',
  accessToken = null
}) => {
  if (!accessToken) throw new Error('Mapbox accessToken required')
  const previewRef = React.createRef()
  return {
    name,
    controlComponent: createControl({ renderControl, renderPreview, previewRef, accessToken }),
    previewComponent: createPreview(previewRef)
  }
}

function MapboxWidget (accessToken) {
  return createWidget({accessToken})
}

export { createWidget, MapboxWidget }
