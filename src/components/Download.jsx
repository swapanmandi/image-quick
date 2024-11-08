import React from "react";
import JSZip from "jszip";
import FileSaver from "file-saver";
import { useDispatch, useSelector } from "react-redux";
import { setFormat } from "../store/imageSlice.js";

export default function Download() {
  const dispatch = useDispatch();

  const orgImagePath = useSelector(state => state.imageEditing.orgImagePath)
  const editedImagePath = useSelector(
    (state) => state.imageEditing.editedImagePath
  );

  const format = useSelector((state) => state.imageEditing.format);
  const handleDownloadImage = () => {
    
    FileSaver.saveAs(editedImagePath[0].filePath, `resized-image.${format}`);
  };

  const handleZipDownload = () => {
    const zip = new JSZip();

    zip.file(
      "resized-image.txt",
      "Please open the images folder to view the resized images."
    );

    const imgFolder = zip.folder("images");

    if (!imgFolder) {
      console.error("Error to create image folder", error);
      return;
    }
    editedImagePath?.forEach((item, index) => {
      const base64Data = item.filePath.split(",")[1];
      imgFolder.file(`resized-image(${index}).${format}`, base64Data, {
        base64: true,
      });
    });

    zip.generateAsync({ type: "blob" }).then((blob) => {
      saveAs(blob, "resized-image.zip");
    });
  };
  //console.log(editedImagePath);
  return (
    <>
      {editedImagePath.length > 0 && (
        <div className=" flex justify-evenly p-2">
          <div className=" flex m-2">
            <p className=" mr-2">Format Type:</p>
            <select
              value={format}
              onChange={(e) => dispatch(setFormat(e.target.value))}
            >
              <option value="jpg">jpg</option>
              <option value="jpeg">jpeg</option>
              <option value="png">png</option>
              <option value="webp">wbp</option>
              <option value="svg">svg</option>
            </select>
          </div>
          <button
            onClick={
              editedImagePath.length > 1 && orgImagePath.length >1
                ? handleZipDownload
                : handleDownloadImage
            }
            className=" bg-darkPalette-400 text-black font-semibold p-1 px-2 rounded-md"
          >
            DOWNLOAD
          </button>
        </div>
      )}
    </>
  );
}
