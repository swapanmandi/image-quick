import React, { useState } from 'react'

export default function AddFile({onChange, resizedWidth, setResizedWidth, resizedHeight, setResizedHeight,onClick, resizedQuality, setResizedQuality}) {
  
  return (
    <>
    <div>Image Resizer</div>
   
<div>
  <input type='file' onChange={onChange}></input>
</div>
<div>
  Width:
  <input type='number' onChange={(e) => setResizedWidth(e.target.value)} value={resizedWidth}></input>
  Height:
  <input type='number' onChange={(e) => setResizedHeight(e.target.value)} value={resizedHeight}></input>
  1-100:
  <input type='number' onChange={(e) => setResizedQuality(e.target.value)} value={resizedQuality} min="10" max="100"></input>
</div>
<div onClick={onClick}>Resize</div>

    </>
  )
}
