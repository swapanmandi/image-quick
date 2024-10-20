import React, { useState } from "react";

export default function AddFile({
  onChange,
  resizedWidth,
  setResizedWidth,
  resizedHeight,
  setResizedHeight,
  onClick,
  resizedQuality,
  setResizedQuality,
  rotate,
  setRotate,
}) {
  return (
    <>
      <div>Image Resizer</div>

      <div>
        <input type="file" onChange={onChange}></input>
      </div>
      <div>
        Width:
        <input
          type="number"
          onChange={(e) => setResizedWidth(e.target.value)}
          value={resizedWidth}
        ></input>
        Height:
        <input
          type="number"
          onChange={(e) => setResizedHeight(e.target.value)}
          value={resizedHeight}
        ></input>
        1-100:
        <input
          type="number"
          onChange={(e) => setResizedQuality(e.target.value)}
          value={resizedQuality}
          min="10"
          max="100"
        ></input>
      </div>
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
      <button onClick={onClick}>Resize</button>
    </>
  );
}
