import * as React from 'react'
import { renderDefaultControl, createControl } from './Control'
import { renderDefaultPreview, createPreview } from './Preview'


const createWidget = ({ 
  renderControl = renderDefaultControl,
  renderPreview = renderDefaultPreview,
  name = 'mapbox'
}) => {
  const previewRef = React.createRef()
  return {
    name,
    controlComponent: createControl({ renderControl, renderPreview, previewRef }),
    previewComponent: createPreview(previewRef)
  }
}

const Widget = createWidget({})

export { createWidget, Widget }
