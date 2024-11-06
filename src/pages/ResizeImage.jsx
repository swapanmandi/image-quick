import React from "react";
import AddFile from "../components/AddFile";
import DisplayImage from "../components/DisplayImage";
import Resize from "../components/Resize";
import { useDispatch, useSelector } from "react-redux";
import { setResizedProgress, setEditedImagePath } from "../store/imageSlice";
import Download from "../components/Download";
import Crop from "../components/Crop";
export default function ResizeImage() {
  const dispatch = useDispatch();

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

  const handleResizeBtn = async () => {
    const totalImages = orgImagePath.length;
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
      for (let i = 0; i < totalImages; i += MAX_CONCURRENT_TASKS) {
        const batch = orgImagePath.slice(i, i + MAX_CONCURRENT_TASKS);
        await processBatch(batch);
      }

      dispatch(setEditedImagePath(resizedImages));

      console.log("All images resized successfully!");
    } catch (error) {
      console.error("Error during resizing:", error);
    }
  };
  console.log("org path", orgImagePath);
  return (
    <div className=" flex flex-col overflow-x-hidden">
      <AddFile />
      <Resize />
      <Crop />
      <DisplayImage />

      <button onClick={handleResizeBtn}>RESIZE</button>
      <Download />
    </div>
  );
}
