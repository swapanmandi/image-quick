import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setOutputFileSize,
  setOrgImagePath,
  clearOrgImagePath,
  setEditedImagePath,
  clearEditedImagePath,
} from "../store/imageSlice.js";
import ReactCrop from "react-image-crop";
import { useLocation } from "react-router-dom";

export default function Crop({ isCropBeforeResize }) {
  const [crop, setCrop] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);

  const orgImagePath = useSelector((state) => state.imageEditing.orgImagePath);

  const dispatch = useDispatch();

  const [isCrop, setIsCrop] = useState(false);

  const previewImageRef = useRef();
  const location = useLocation();
  const handleCropImge = () => {
    setCrop({
      unit: "px", // Can be 'px' or '%'
      x: 25,
      y: 25,
      width: 100,
      height: 100,
    });
    setIsCrop(true);
  };

  const handleSaveCrop = () => {
    if (
      completedCrop &&
      completedCrop.width > 0 &&
      completedCrop.height > 0 &&
      previewImageRef.current
    ) {
      const image = previewImageRef.current;
      const canvas = document.createElement("canvas");

      // Calculate scaling factors
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // Set canvas dimensions according to the cropped area
      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;

      const ctx = canvas.getContext("2d");

      // rotation if necessary
      // if (rotate) {
      //   ctx.translate(canvas.width / 2, canvas.height / 2);
      //   ctx.rotate((rotate * Math.PI) / 180);
      //   ctx.translate(-canvas.width / 2, -canvas.height / 2);
      // }

      // Draw the cropped image on the canvas
      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const croppedImageUrl = canvas.toDataURL("image/jpeg");

      if (croppedImageUrl) {
        console.log("Cropped image generated successfully!");
        if (isCropBeforeResize) {
          dispatch(clearOrgImagePath());
          dispatch(setOrgImagePath(croppedImageUrl));
        }

        if (!isCropBeforeResize) {
          dispatch(setEditedImagePath([{ filePath: croppedImageUrl }]));
        }
        const croppedImageUrlLength = croppedImageUrl?.length;
        const imageSizeInBytes =
          4 * Math.ceil(croppedImageUrlLength / 3) * 0.5624896334383812;
        const imageSizeInKb = (imageSizeInBytes / 1024).toFixed(2);
        dispatch(setOutputFileSize(imageSizeInKb));
        setIsCrop(false);
        setCrop(null);
      } else {
        console.error("Failed to generate cropped image!");
      }
    } else {
      console.error("Invalid crop dimensions: Width or height is zero.");
    }
    setCrop(false);
  };

  //console.log("org path", orgImagePath);

  // useEffect(() => {
  //   return () => {
  //     dispatch(clearOrgImagePath());
  //     dispatch(clearEditedImagePath());
  //   };
  // }, []);

  useEffect(() => {
    if (location.pathname) {
      dispatch(clearEditedImagePath());
    }
  }, [location.pathname]);

  return (
    <div className=" w-full flex justify-center">
      <div className=" w-full lg:w-1/2 m-2 ">
        {isCrop && (
          <div className=" m-4 lg:m-8 flex justify-center">
            <ReactCrop
              crop={crop}
              onChange={(newCrop) => {
                if (newCrop.width > 0 && newCrop.height > 0) {
                  setCrop(newCrop);
                }
              }}
              onComplete={(c) => {
                if (c.width > 0 && c.height > 0) {
                  setCompletedCrop(c);
                }
              }}
            >
              <img
                ref={previewImageRef}
                src={orgImagePath}
                className="w-60 h-60 lg:w-96 lg:h-96"
                alt="Crop Preview"
              />
            </ReactCrop>
          </div>
        )}
        <div className=" ">
          {orgImagePath.length === 1 && (
            <div className=" flex justify-around">
              {!isCrop && !completedCrop && (
                <button
                  className=" bg-darkPalette-400 rounded-md p-1 px-2"
                  onClick={handleCropImge}
                >
                  Crop
                </button>
              )}
              {isCrop && (
                <button
                  className=" bg-darkPalette-400  rounded-md p-1 px-2"
                  onClick={handleSaveCrop}
                >
                  Save
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
