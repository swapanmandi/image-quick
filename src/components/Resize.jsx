import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSizeType,
  setResizedWidth,
  setResizedHeight,
} from "../store/imageSlice";

export default function Resize() {
  const dispatch = useDispatch();
  const resizedWidth = useSelector((state) => state.imageEditing.resizedWidth);
  const resizedHeight = useSelector(
    (state) => state.imageEditing.resizedHeight
  );
  const sizeType = useSelector((state) => state.imageEditing.sizeType);

  const sizeTypes = [
    { label: "pixel", value: "pixel" },
    { label: "percentage", value: "percentage" },
  ];

  return (
    <div className=" w-full flex justify-center">
      <div className=" p-4 space-y-2 lg:w-1/2">
        <div className="flex items-center lg:mb-4">
          {sizeTypes.map((item) => (
            <label className=" mr-2" key={item.label}>
              <input
                className=" m-2"
                value={item.value}
                onChange={(e) => dispatch(setSizeType(e.target.value))}
                type="radio"
                checked={sizeType === item.value}
              ></input>
              {item.label}
            </label>
          ))}
        </div>

        <div className=" flex justify-between lg:justify-start">
          <p className="mr-2">Width:</p>
          <input
            className=" bg-slate-900 text-white w-28 mr-2  outline-none p-1 rounded-md lg:mr-8"
            type="number"
            onChange={(e) => dispatch(setResizedWidth(e.target.value))}
            value={resizedWidth}
            placeholder={sizeType === "pixel" ? "pixel" : " %"}
            required
          ></input>

          <p className=" mr-2">Height:</p>
          <input
            className=" bg-slate-900 w-28 text-white outline-none p-1 rounded-md"
            type="number"
            onChange={(e) => dispatch(setResizedHeight(e.target.value))}
            value={resizedHeight}
            placeholder={sizeType === "pixel" ? "pixel" : " %"}
            required
          ></input>
        </div>
      </div>
    </div>
  );
}
