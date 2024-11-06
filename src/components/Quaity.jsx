import React from "react";

export default function Quaity({ resizedQuality, setResizedQuality }) {
  return (
    <>
      <div>
        Quality:
        <input
          type="range"
          onChange={(e) => setResizedQuality(e.target.value)}
          value={resizedQuality}
          min="10"
          max="100"
        />
        {resizedQuality}
      </div>
    </>
  );
}
