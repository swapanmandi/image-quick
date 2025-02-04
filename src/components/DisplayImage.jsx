import React, { useEffect, useRef, useState } from "react";
import "react-image-crop/dist/ReactCrop.css";
import { useSelector } from "react-redux";

export default function DisplayImage() {
  const orgImagePath = useSelector((state) => state.imageEditing.orgImagePath);
  const editedImagePath = useSelector(
    (state) => state.imageEditing.editedImagePath
  );
  const resizedWidth = useSelector((state) => state.imageEditing.resizedWidth);
  const resizedHeight = useSelector(
    (state) => state.imageEditing.resizedHeight
  );
  const rotate = useSelector((state) => state.imageEditing.rotate);
  const outputFileSize = useSelector(
    (state) => state.imageEditing.outputFileSize
  );
  //console.log("org", orgImagePath)

  return (
    <div className=" m-4 flex justify-center">
      {orgImagePath.length > 0 && (
        <div className=" w-full lg:w-1/2 flex flex-col ">
          {orgImagePath.length === 1 ? "Selected Image:" : "Selected Images:"}
          <div className=" flex justify-center items-center m-2">
            {orgImagePath?.length === 1 && (
              <img
                className=" img-canvas  w-60 h-60 lg:w-80 lg:h-80"
                src={orgImagePath}
                alt="Selected Image"
              />
            )}
          </div>

          {editedImagePath && editedImagePath.length === 1 && (
            <div>
              <p>Output Image:</p>
              <div className=" flex justify-center">
                <img
                  className="max-w-60 max-h-60 m-2"
                  src={editedImagePath[0]?.filePath}
                  alt="Output Image"
                />
              </div>
              <div>
                <h2 className=" font-semibold">Output Info:</h2>
                <p>Width: {resizedWidth} Pixel</p>
                <p>Height: {resizedHeight} Pixel</p>
                <p>
                  Expected File Size:{" "}
                  {outputFileSize || editedImagePath[0]?.fileSize} KB
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
