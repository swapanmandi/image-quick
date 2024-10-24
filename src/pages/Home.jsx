import React, { useState } from "react";
import AddFile from "../components/AddFile.jsx";
import DisplayImage from "../components/DisplayImage.jsx";
import axios from "axios";
import fileDownload from "js-file-download";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function Home() {
  const [editedImagePath, setEditedImagePath] = useState([]);
  const [orgImagePath, setOrgImagePath] = useState([]);
  const [resizedWidth, setResizedWidth] = useState("");
  const [sizeType, setSizeType] = useState("pixel");
  const [resizedHeight, setResizedHeight] = useState("");
  const [resizedQuality, setResizedQuality] = useState("100");
  const [editedImageSize, setEditedImageSize] = useState("");
  const [rotate, setRotate] = useState(0);
  const [format, setFormat] = useState("jpg");
  const [resizedProgress, setResizedProgress] = useState(0)

//   const handleResizeBtn = () => {
//     const totalImages = orgImagePath.length
//     let resizedCount = 0
//     orgImagePath?.map((item) => {
//       try {
//         const img = new Image();
//         img.src = item;
//         img.onload = () => {
//           const canvas = document.createElement("canvas");
//           const ctx = canvas.getContext("2d");
//           console.log("w", img.width);
  
//           if (sizeType === "percentage") {
//             canvas.width = (img.width * resizedWidth) / 100;
//             canvas.height = (img.height * resizedWidth) / 100;
//           } else {
//             canvas.width = resizedWidth;
//             canvas.height = resizedHeight;
//           }
  
//           if (rotate) {
//             ctx.translate(canvas.width / 2, canvas.height / 2);
//             ctx.rotate((rotate * Math.PI) / 180);
//             ctx.translate(-canvas.width / 2, -canvas.height / 2);
//           }
  
//           ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
//           const resizedDataURL = canvas.toDataURL(
//             "image/jpeg",
//             0.01 * resizedQuality
//           );
//           const resizedDataUrlLength = resizedDataURL.length;
//           const imageSizeInBytes =
//             4 * Math.ceil(resizedDataUrlLength / 3) * 0.5624896334383812;
//           const imageSizeInKb = (imageSizeInBytes / 1024).toFixed(2);
//           //console.log("resized size:", imageSizeInKb)
//           // setEditedImageSize(imageSizeInKb);
//           // setEditedImagePath(resizedDataURL);
//           setEditedImagePath((prev) => [
//             ...prev,
//             { filePath: resizedDataURL, fileSize: imageSizeInKb },
//           ]);
// resizedCount++;
// setResizedProgress((resizedCount / totalImages) * 100)

//         };
//       } catch (error) {
//         console.error("Error to resize the image", error)
//       } finally{
//         console.log("Resize is completed.")
//       }
//     });
//   };

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

          const resizedDataURL = canvas.toDataURL("image/jpeg", 0.01 * resizedQuality);
          const resizedDataUrlLength = resizedDataURL.length;
          const imageSizeInBytes = 4 * Math.ceil(resizedDataUrlLength / 3) * 0.5624896334383812;
          const imageSizeInKb = (imageSizeInBytes / 1024).toFixed(2);

          resizedImages.push({ filePath: resizedDataURL, fileSize: imageSizeInKb });

          resizedCount++;
          const progress = Math.trunc((resizedCount / totalImages) * 100);
          setResizedProgress(progress);

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

    
    setEditedImagePath((prev) => [...prev, ...resizedImages]);

    console.log("All images resized successfully!");
  } catch (error) {
    console.error("Error during resizing:", error);
  }
};


  const onChange = async (event) => {
    try {
      event.map((item) => {
        const filePath = URL.createObjectURL(item);
        setOrgImagePath((prev) => [...prev, filePath]);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDownloadImage = () => {
    axios
      .get(editedImagePath[0].filePath, { responseType: "blob" })
      .then((res) => {
        fileDownload(res.data, `resized-image.${format}`);
      });
  };

  const handleZipDownload = () => {
    const zip = new JSZip();
    
    zip.file("resized-image.txt", "Please open the images folder to view the resized images.");

    const imgFolder = zip.folder("images");

    if (!imgFolder) {
      console.error("Error to create image folder", error);
      return;
    }
    editedImagePath?.forEach((item, index) => {
      const base64Data = item.filePath.split(',')[1];
      imgFolder.file(`resized-image(${index}).${format}`, base64Data, {
        base64: true,
      });
    });

    zip.generateAsync({ type: "blob" }).then((blob) => {
      saveAs(blob, "resized-image.zip");
    });
  };

  // console.log("files", orgImagePath);
   console.log("edited image", editedImagePath);
 
  return (
    <>
      <AddFile
        onChange={onChange}
        resizedWidth={resizedWidth}
        setResizedWidth={setResizedWidth}
        resizedHeight={resizedHeight}
        setResizedHeight={setResizedHeight}
        onClick={handleResizeBtn}
        resizedQuality={resizedQuality}
        setResizedQuality={setResizedQuality}
        rotate={rotate}
        setRotate={setRotate}
        sizeType={sizeType}
        setSizeType={setSizeType}
      />

      <DisplayImage
        imgUrl={editedImagePath}
        setEditedImageSize={setEditedImageSize}
        editedImageSize={editedImageSize}
        resizedWidth={resizedWidth}
        resizedHeight={resizedHeight}
        orgImagePath={orgImagePath}
        setOrgImagePath={setOrgImagePath}
        setEditedImagePath={setEditedImagePath}
        rotate={rotate}
      />
      <div>
        Format Type:
        <select value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="jpg">jpg</option>
          <option value="jpeg">jpeg</option>
          <option value="png">png</option>
          <option value="webp">wbp</option>
          <option value="svg">svg</option>
        </select>
      </div>
      <span>Completed: {resizedProgress} %</span>
      <button
        onClick={
          editedImagePath.length > 1 ? handleZipDownload : handleDownloadImage
        }
      >
        {" "}
        Download
      </button>
    </>
  );
}
