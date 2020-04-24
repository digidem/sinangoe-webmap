import CMS from 'netlify-cms-app'
import { Widget as ReorderWidget } from '@ncwidgets/reorder'
import { Widget as IdWidget } from '@ncwidgets/id'
// import { MapboxWidget } from './mapbox-widget'
import { Widget as MapboxLayerPicker } from './layer-picker'

const mapboxConfig = require('../../mapbox-config.js')

// CMS.registerWidget(MapboxWidget(mapboxConfig.accessToken))
CMS.registerWidget(ReorderWidget)
CMS.registerWidget(IdWidget)
CMS.registerWidget(MapboxLayerPicker)

CMS.init()
