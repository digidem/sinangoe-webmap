import CMS from 'netlify-cms-app'
import { Widget as ReorderWidget } from '@ncwidgets/reorder'
import { Widget as FileRelation } from '@ncwidgets/file-relation'
// import { Widget as MapboxWidget } from './mapbox-widget'

//CMS.registerWidget(MapboxWidget)
CMS.registerWidget(ReorderWidget)
CMS.registerWidget(FileRelation)

CMS.init()