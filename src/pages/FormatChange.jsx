import React, { useEffect } from "react";
import Download from "../components/Download";
import AddFile from "../components/AddFile";
import DisplayImage from "../components/DisplayImage";
import { setEditedImagePath, clearEditedImagePath } from "../store/imageSlice";
import { useDispatch, useSelector } from "react-redux";

export default function FormatChange() {
  const dispatch = useDispatch();
  const orgImagePath = useSelector((state) => state.imageEditing.orgImagePath);
  const format = useSelector((state) => state.imageEditing.format);
  const editedImagePath = useSelector(
    (state) => state.imageEditing.editedImagePath
  );

  const handleFormatChange = () => {
    orgImagePath.forEach((path) => {
      const canvas = document.createElement("canvas");
      const img = new Image();
      img.src = path;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const formatedImg = canvas.toDataURL(`imgage/${format}`, 1);
        const formatedImgLength = formatedImg.length;
        const formatedImageSizeInBytes =
          4 * Math.ceil(formatedImgLength / 3) * 0.5624896334383812;
        const formatedImageSizeInKb = (formatedImageSizeInBytes / 1024).toFixed(
          2
        );
        dispatch(
          setEditedImagePath([
            { filePath: formatedImg, fileSize: formatedImageSizeInKb },
          ])
        );
      };
    });
  };

  useEffect(() => {
    return () => {
      //dispatch(clearOrgImagePath());
      dispatch(clearEditedImagePath());
    };
  }, []);

  return (
    <div className=" w-full p-3">
      <div>
        <h1 className=" text-2xl place-self-center">Image Format Change</h1>

        <AddFile />
        <DisplayImage />
        <Download />
      </div>
      {orgImagePath.length > 0 && editedImagePath.length == 0 && (
        <div className=" flex justify-center">
          <button
            className=" bg-darkPalette-400 p-1 px-2 rounded-md text-black"
            onClick={handleFormatChange}
          >
            Change Format
          </button>
        </div>
      )}

      <div className=" w-full flex flex-col justify-center items-center pt-14">
        <p>
          Change your image format to a custom format in a few simple steps.
          Upload one or more images, click "Change Format" button and download
          your file.
        </p>
        <p>Supported Images: JPG, JPEG, PNG, WEBP, SVG</p>
      </div>
    </div>
  );
}
