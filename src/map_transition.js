var EventEmitter = require('events')
var debug = function () {}
if (process.env.NODE_ENV !== 'production') {
  debug = require('debug')('mapa-waorani:prefetch')
}

var content = require('../_data/data.json')
var views = content.map_views

var FADEIN_DURATION = 1000
var FADEOUT_DURATION = 250
var FLY_SPEED = 0.5

// These layers are complex to draw (calculating collisions) so we always
// hide them when transitioning between map views to avoid animation jitter
var HIDDEN_TRANSITION_LAYERS = [
]

var timeoutId

// TODO: expand layers programmatically
var hiddenLayersExpanded = []
var loaded = false
var events = new EventEmitter()

module.exports = mapTransition

function mapTransition (viewId, map, fitBoundsOptions) {
  fitBoundsOptions = Object.assign({}, {speed: FLY_SPEED}, fitBoundsOptions)
  var view = views[viewId]
  debug('Transition view:', viewId)
  if (!view) return console.warn('undefined view', viewId)

  // It's a little tricky to cancel other transition events, because each
  // call to mapTransition() creates a new instance of the functions that we
  // call, so we use a global event emitter to stop all other transitions
  events.emit('stop')
  events.once('stop', function () {
    map.stop()
    map.off('sourcedata', onsourcedata)
    map.off('styledata', retry)
    map.off('moveend', showOverlays)
  })
  if (timeoutId) clearTimeout(timeoutId)

  if (!(loaded || map.isStyleLoaded())) {
    map.once('styledata', retry)
    return
  }

  if (!hiddenLayersExpanded) expandLayerGlobs(map)

  fadeoutLayers()
  debug(viewId + ':', 'fadeout layers')
  timeoutId = setTimeout(function () {
    debug(viewId + ':', 'move map')
    hideOverlays()
    moveMap()
  }, FADEOUT_DURATION)

  map.once('moveend', showOverlays)

  function showOverlays () {
    Object.keys(view.layers).forEach(function (layerId) {
      if (!map.getLayer(layerId)) return console.warn('no layer', layerId)
      var currentVisibility = map.getLayoutProperty(layerId, 'visibility')
      var targetVisibility = view.layers[layerId]
      if (currentVisibility === 'none' && targetVisibility > 0) {
        setLayerOpacity(map, layerId, 0, 0)
        map.setLayoutProperty(layerId, 'visibility', 'visible')
      }
    })
    // Don't fadein until tiles are loaded, avoid sudden transition
    if (map.areTilesLoaded()) {
      debug(viewId + ':', 'tiles were loaded, fading in')
      return fadeinLayers()
    }
    debug(viewId + ':', 'tiles were not loaded, setting tiledata listener')
    map.on('sourcedata', onsourcedata)
  }

  function onsourcedata () {
    debug(viewId + ':', 'tiledata')
    if (!map.areTilesLoaded()) return
    debug(viewId + ':', 'fading in tiles after load')
    map.off('sourcedata', onsourcedata)
    fadeinLayers()
  }

  function fadeoutLayers () {
    // Fadeout layers that we need to hide during transitions for perf
    hiddenLayersExpanded.forEach(function (layerId) {
      if (!map.getLayer(layerId)) return console.warn('no layer', layerId)
      setLayerOpacity(map, layerId, 0, FADEOUT_DURATION)
    })

    // TODO: Use opacity from mapbox?
    // Fadeout layers that do not appear in the target view
    Object.keys(map.style._layers).forEach(function (layerId) {
      if (view.layers[layerId] > 0) return
      // debug('fadeout', layerId)
      setLayerOpacity(map, layerId, 0, FADEOUT_DURATION)
    })
  }

  function fadeinLayers () {
    // Fadein layers in target view
    Object.keys(view.layers).forEach(function (layerId) {
      debug(viewId + ': fadein', layerId)
      setLayerOpacity(map, layerId, view.layers[layerId], FADEIN_DURATION)
    })
  }

  function moveMap () {
    var bounds = [
      [view.minLon, view.minLat],
      [view.maxLon, view.maxLat]
    ]
    map.fitBounds(bounds, Object.assign(fitBoundsOptions, {
      pitch: view.pitch || 0,
      bearing: view.bearing || 0
    }))
  }

  function hideOverlays () {
    hiddenLayersExpanded.forEach(function (layerId) {
      if (!map.getLayer(layerId)) return console.warn('no layer', layerId)
      map.setLayoutProperty(layerId, 'visibility', 'none')
    })
  }

  // We define this here so we can set it to run on map load, but then
  // turn off the event if needed if another map transition is called
  // before the map loads.
  function retry () {
    loaded = true
    mapTransition(viewId, map)
  }
}

function setLayerOpacity (map, layerId, visible, duration) {
  if (typeof duration === 'undefined') duration = FADEIN_DURATION
  var layer = map.getLayer(layerId)
  if (!layer) return console.error('no layer', layerId)
  var props = getOpacityPropNames(layer)
  props.forEach(function (name) {
    var opacity = visible
    if (visible) {
      // Fetch opacith from mapbox layer
      try {
        // This is super hacky, there must be a better way
        // Not even sure this works for all cases...
        var defaultValues = layer.paint._properties.defaultPropertyValues[name]
        opacity = visible ? defaultValues.property.specification.default : 0
      } catch (err) {
        console.error('Failed to fetch default opacity value from layer, using 1')
        console.error(err)
      }
    }
    map.setPaintProperty(layerId, name, opacity)
  })
}

function expandLayerGlobs (map) {
  var mapLayers = map.getStyle().layers.map(function (l) {
    return l.id
  })
  hiddenLayersExpanded = mm(mapLayers, HIDDEN_TRANSITION_LAYERS)
  Object.keys(views).forEach(function (key) {
    var expandedLayerOpacity = {}
    var layerMatchPatterns = Object.keys(views[key].layerOpacity)
    layerMatchPatterns.forEach(function (pattern) {
      var matchedLayers = mm(mapLayers, [pattern])
      matchedLayers.forEach(function (layerId) {
        expandedLayerOpacity[layerId] = views[key].layerOpacity[pattern]
      })
    })
    views[key].layerOpacity = expandedLayerOpacity
  })
}

function getOpacityPropNames (layer) {
  if (layer.type !== 'symbol') return [layer.type + '-opacity']
  var propNames = []
  if (layer.getLayoutProperty('icon-image')) propNames.push('icon-opacity')
  if (layer.getLayoutProperty('text-field')) propNames.push('text-opacity')
  return propNames
}

function mm (list, patterns) {
  var regexps = patterns.map(function (p) {
    return new RegExp(p.replace('*', '.*'))
  })
  return list.filter(function (str) {
    return regexps.some(function (regexp) {
      return regexp.exec(str)
    })
  })
}
