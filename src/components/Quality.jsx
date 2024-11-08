import React from "react";
import { setResizedQuality } from "../store/imageSlice.js";
import { useDispatch, useSelector } from "react-redux";

export default function Quaity() {
  const dispatch = useDispatch();
  const resizedQuality = useSelector(
    (state) => state.imageEditing.resizedQuality
  );
  return (
    <>
      <div>
        Quality:
        <input
          type="range"
          onChange={(e) => dispatch(setResizedQuality(e.target.value))}
          value={resizedQuality}
          min="10"
          max="100"
        />
        {resizedQuality}
      </div>
    </>
  );
}
