import React from "react";

import AddFile from "../components/AddFile";
import DisplayImage from "../components/DisplayImage";
import Download from "../components/Download";
import Crop from "../components/Crop";

export default function CropImage() {
  return (
    <div className=" p-3">
      <h1 className=" text-2xl"> Resize Image</h1>
      <p>
        Crop your images to a custom size in a few simple steps. Upload one or
        more images, click "Crop" button and download your file.
      </p>
      <p>Supported Images: JPG, JPEG, PNG, WEBP, SVG</p>
      <AddFile />
      {/* <DisplayImage /> */}
      <Crop />
      <Download />
    </div>
  );
}
