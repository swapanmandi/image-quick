import React from "react";
import AddFile from "../components/AddFile";
import Download from "../components/Download";
import Crop from "../components/Crop";

export default function CropImage() {
  return (
    <div className=" p-3">
      <h1 className=" text-2xl place-self-center"> Crop Image</h1>

      <AddFile />
      <Crop />
      <Download />

      <div className=" w-full flex flex-col justify-center items-center pt-14">
        <p>
          Crop your images to a custom size in a few simple steps. Upload one or
          more images, click "Crop" button and download your file.
        </p>
        <p>Supported Images: JPG, JPEG, PNG, WEBP, SVG</p>
      </div>
    </div>
  );
}
