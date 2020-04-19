import CMS from 'netlify-cms-app'
import { Widget as ReorderWidget } from '@ncwidgets/reorder'
import { Widget as FileRelation } from '@karissa/file-relation'
import { MapboxWidget } from './mapbox-widget'

const mapboxConfig = require('../../mapbox-config.js')

CMS.registerWidget(MapboxWidget(mapboxConfig.accessToken))
CMS.registerWidget(ReorderWidget)
CMS.registerWidget(FileRelation)

CMS.init()
