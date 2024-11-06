import React from 'react'

export default function Rotate({rotate,
  setRotate,}) {
  return (
    <>
     <div>
        Rotate:
        <input
          id="rotate-input"
          type="number"
          value={rotate}
          onChange={(e) =>
            setRotate(Math.min(270, Math.max(0, Number(e.target.value))))
          }
        />
      </div>
    </>
  )
}
