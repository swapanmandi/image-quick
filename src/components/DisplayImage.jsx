import React, { useRef, useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export default function DisplayImage({
  imgUrl,
  editedImageSize,
  setEditedImageSize,
  resizedWidth,
  resizedHeight,
  orgImagePath,
  setOrgImagePath,
  setEditedImagePath,
  rotate,
}) {
  const [crop, setCrop] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isCrop, setIsCrop] = useState(false);
  const previewImageRef = useRef(null);

  const handleCropImge = () => {
    setCrop({
      unit: "px", // Can be 'px' or '%'
      x: 25,
      y: 25,
      width: 100,
      height: 100,
    })
    setIsCrop(true);
  };

  const handleSaveCrop = () => {

    if (completedCrop && completedCrop.width > 0 && completedCrop.height > 0 && previewImageRef.current) {
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
        setOrgImagePath(croppedImageUrl);
        setEditedImagePath(croppedImageUrl)
        const croppedImageUrlLength = croppedImageUrl.length;
      const imageSizeInBytes =
        4 * Math.ceil(croppedImageUrlLength / 3) * 0.5624896334383812;
      const imageSizeInKb = (imageSizeInBytes / 1024).toFixed(2);
        setEditedImageSize(imageSizeInKb)
        setIsCrop(false);
        setCrop(null)
      } else {
        console.error("Failed to generate cropped image!");
      }
    } else {
      console.error("Invalid crop dimensions: Width or height is zero.");
    }
  };

  return (
    <div>
      Original Image:
      {!isCrop && <img src={""} style={{ width: "250px", height: "300px", transform: `rotate(${rotate}deg)` }} alt="Original" />}
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
        {isCrop && (
          <div>
            <img
              ref={previewImageRef}
              src={orgImagePath}
              style={{ maxWidth: "300px", maxHeight:"300px", transform: `rotate(${rotate}deg)` }}
              alt="Crop Preview"
            />
            <button onClick={handleSaveCrop}>Save</button>
          </div>
        )}
      </ReactCrop>
      <button onClick={handleCropImge}>Crop</button>
      Resized Image:
      <img id="imgContainer" src={""} alt="Resized" />
      <p>Resized Image Width: {resizedWidth} Pixel</p>
      <p>Resized Image Height: {resizedHeight} Pixel</p>
      <p>Expected Resized Image Size: {editedImageSize} KB</p>
    </div>
  );
}
