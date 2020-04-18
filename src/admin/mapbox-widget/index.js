import Control from './Control'
import Preview from './Preview'

if (typeof window !== 'undefined') {
  window.Control = Control
  window.Preview = Preview
}
const Widget = {
  name: 'mapbox',
  controlComponent: Control,
  previewComponent: Preview
}

export {
  Widget,
  Control,
  Preview
}
