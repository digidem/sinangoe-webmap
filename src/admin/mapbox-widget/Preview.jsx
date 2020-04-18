import React from 'react'

export const createPreview = (ref) => () => <div ref={ref} />
export const renderDefaultPreview = ({ value }) => <DefaultPreview value={value} />

const DefaultPreview = ({ value }) => {
  console.log('RENDERING', value)
  if (!value) return <div></div>
  console.log('RENDERING', value.styleURL, value.layers.length)
  const layers = value.layers
  return (<div>
    {layers && layers.map((layer) => {
      return <div>{layer.id}</div>
    })}
  </div>
  )
}
