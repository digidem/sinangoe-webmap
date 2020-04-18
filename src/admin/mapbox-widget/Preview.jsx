import React from 'react'

export const createPreview = (ref) => () => <div ref={ref} />
export const renderDefaultPreview = ({ value }) => <DefaultPreview value={value} />

const DefaultPreview = ({ value }) => {
  const { layers, styleURL } = value.toJS()
  if (!value) return <div></div>
  console.log('RENDERING', styleURL, layers && layers.length)
  return (<div>
    {layers && layers.map((layer) => {
      return <div>{layer.id}</div>
    })}
  </div>
  )
}
