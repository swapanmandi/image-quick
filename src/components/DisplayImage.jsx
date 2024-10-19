import React from "react";

export default function DisplayImage({ imgUrl, editedImageSize, resizedWidth, resizedHeight }) {
 
  return (
    <div>
      <img id="imgContainer" src={imgUrl}></img>
      <p>Resized Image Width: {resizedWidth} Pixel</p>
      <p>Resized Image Height: {resizedHeight} Pixel</p>
      <p>Expected Resized Image Size : {editedImageSize} KB</p>
    </div>
  );
}
