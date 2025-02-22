import React, { useEffect, useState } from "react";
import AddFile from "../components/AddFile";
import DisplayImage from "../components/DisplayImage";
import Resize from "../components/Resize";
import { useDispatch, useSelector } from "react-redux";
import {
  setResizedProgress,
  setEditedImagePath,
  clearEditedImagePath,
} from "../store/imageSlice";
import Download from "../components/Download";
import Crop from "../components/Crop";
import Quality from "../components/Quality.jsx";
import { useLocation } from "react-router-dom";

export default function ResizeImage() {
  const [isCropBeforeResize, setIsCropBeforeResize] = useState(false);
  const [isResized, setIsResized] = useState(false);
  const [orgFileSize, setOrgFileSize] = useState("");

  console.log(orgFileSize);

  const dispatch = useDispatch();
  const location = useLocation();
  const orgImagePath = useSelector((state) => state.imageEditing.orgImagePath);
  const resizedWidth = useSelector((state) => state.imageEditing.resizedWidth);
  const resizedHeight = useSelector(
    (state) => state.imageEditing.resizedHeight
  );
  const sizeType = useSelector((state) => state.imageEditing.sizeType);
  const rotate = useSelector((state) => state.imageEditing.rotate);
  const resizedQuality = useSelector(
    (state) => state.imageEditing.resizedQuality
  );
  const format = useSelector((state) => state.imageEditing.format);
  const editedImagePath = useSelector(
    (state) => state.imageEditing.editedImagePath
  );

  useEffect(() => {
    if (orgImagePath.length === 1) {
      setIsCropBeforeResize(true);
    }
  }, [orgImagePath]);

  const findImageSize = async () => {
    const sizes = await Promise.all(
      orgImagePath.map(async (item) => {
        const blobResponse = await fetch(item);
        const blob = await blobResponse.blob();
        const kbSize = parseFloat((blob.size / 1024).toFixed(2));
        return parseFloat(kbSize);
      })
    );

    const totalSize = sizes.reduce((acc, size) => acc + size, 0);
    setOrgFileSize(totalSize)
  };

  useEffect(() => {
    findImageSize();
  }, [orgImagePath]);

  const handleResizeBtn = async () => {
    const totalImages = orgImagePath.length;
    if (!resizedWidth && !resizedHeight) return;
    let resizedCount = 0;
    const MAX_CONCURRENT_TASKS = 5;
    let resizedImages = [];

    const resizeImage = (item) => {
      return new Promise((resolve, reject) => {
        try {
          const img = new Image();
          img.src = item;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // Resize logic
            if (sizeType === "percentage") {
              canvas.width = (img.width * resizedWidth) / 100;
              canvas.height = (img.height * resizedWidth) / 100;
            } else {
              canvas.width = resizedWidth;
              canvas.height = resizedHeight;
            }

            if (rotate) {
              ctx.translate(canvas.width / 2, canvas.height / 2);
              ctx.rotate((rotate * Math.PI) / 180);
              ctx.translate(-canvas.width / 2, -canvas.height / 2);
            }
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const resizedDataURL = canvas.toDataURL(
              `image/${format}`,
              0.01 * resizedQuality
            );
            const resizedDataUrlLength = resizedDataURL.length;
            const imageSizeInBytes =
              4 * Math.ceil(resizedDataUrlLength / 3) * 0.5624896334383812;
            const imageSizeInKb = (imageSizeInBytes / 1024).toFixed(2);

            resizedImages.push({
              filePath: resizedDataURL,
              fileSize: imageSizeInKb,
            });

            resizedCount++;
            const progress = Math.trunc((resizedCount / totalImages) * 100);
            dispatch(setResizedProgress(progress));

            resolve();
          };

          img.onerror = (err) => reject(err);
        } catch (error) {
          reject(error);
        }
      });
    };

    const processBatch = async (batch) => {
      await Promise.all(batch.map((item) => resizeImage(item)));
    };

    try {
      if (resizedWidth && resizedHeight) {
        for (let i = 0; i < totalImages; i += MAX_CONCURRENT_TASKS) {
          const batch = orgImagePath.slice(i, i + MAX_CONCURRENT_TASKS);
          await processBatch(batch);
        }
      }

      dispatch(setEditedImagePath(resizedImages));

      console.log("All images resized successfully!");
    } catch (error) {
      console.error("Error during resizing:", error);
    }
    setIsResized(true);
  };
  console.log("edited img", editedImagePath);

  useEffect(() => {
    if (location.pathname) {
      dispatch(clearEditedImagePath());
    }
  }, [location.pathname]);

 

  return (
    <div className=" flex flex-col overflow-x-hidden p-2 mb-4">
      <h1 className=" text-2xl place-self-center"> Resize Image</h1>

      <AddFile />

      {isResized && <DisplayImage />}
      {editedImagePath.length == 0 && (
        <div>
          <Crop isCropBeforeResize={isCropBeforeResize} />
          {orgImagePath.length > 0 && <Resize />}

          {orgImagePath.length > 0 && (
            <div className="w-full flex flex-col justify-center items-center">
              <p>
                Original File Size: <span>{orgFileSize ? orgFileSize : "00"} KB</span>
              </p>
              <Quality />
              <button
                className=" bg-darkPalette-400 p-1 rounded-md w-fit px-2 text-black m-2"
                onClick={handleResizeBtn}
              >
                Resize
              </button>
            </div>
          )}
        </div>
      )}
      {editedImagePath.length >= 0 && <Download />}
    

      <div className=" w-full flex flex-col justify-center items-center pt-14">
        <p>
          Resize your images to a custom size in a few simple steps. Upload one
          or more images or You can crop it before resize, click "Resize" button
          and download your file.
        </p>
        <p>Supported Images: JPG, JPEG, PNG, WEBP, SVG</p>
      </div>
    </div>
  );
}
