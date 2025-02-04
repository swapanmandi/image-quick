import React, { useRef, useState } from "react";
import AddFile from "../components/AddFile";
import DisplayImage from "../components/DisplayImage";
import jsPDF from "jspdf";
import { useSelector } from "react-redux";
import html2canvas from "html2canvas";
import { setResizedProgress } from "../store/imageSlice.js";
import FeaturesSection from "../components/FeaturesSection.jsx";
import Quality from "../components/Quality.jsx";

export default function ImageToPdf() {
  const [pdfFileSize, setPdfFileSize] = useState("");
  const [imageFileSize, setImageFileSize] = useState("");
  const [resiuality, setResizedQuality] = useState("");

  const orgImagePath = useSelector((state) => state.imageEditing.orgImagePath);

  const resizedQuality = useSelector(
    (state) => state.imageEditing.resizedQuality
  );
  const format = useSelector((state) => state.imageEditing.format);

  const pdfRef = useRef();

  const handleImageToPdfBtn = async () => {
    const pdf = new jsPDF();
    pdfRef.current = pdf;
    const totalImages = orgImagePath.length;

    try {
      for (let i = 0; i < totalImages; i++) {
        const imagePath = orgImagePath[i];
        const img = new Image();
        img.src = imagePath;

        await new Promise((resolve, reject) => {
          img.onload = async () => {
            // const imageContainer = document.querySelector(`.img-canvas-${i}`);

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const resizedDataURL = canvas.toDataURL(
              `image/${format}`,
              0.01 * resizedQuality
            );

            let xOrdinate = 12.7; // IN MM
            let yOrdinate = 12.7; // IN MM
            let imgWidth = (canvas.width / 72) * 25.4; // IN MM
            let imgHeight = (canvas.height / 72) * 25.4; // IN MM
            //const pageHeight = pdf.internal.pageSize.height; // IN MM
            //const pageWidth = pdf.internal.pageSize.width; // IN MM

            if (imgWidth > 185.42) {
              imgWidth = 185.42;
            } else {
              xOrdinate = xOrdinate + 185.42 / 2 - imgWidth / 2;
            }
            if (imgHeight > 271.78) {
              if (img.width === img.height) {
                imgHeight = imgWidth;
                yOrdinate = yOrdinate + 271.78 / 2 - imgHeight / 2;
              } else {
                imgHeight = 271.78;
              }
            } else {
              yOrdinate = yOrdinate + 271.78 / 2 - imgHeight / 2;
            }

            //  console.log("imgWidth-imgHeight", img.width, img.height);
            //  console.log("w-h", imgWidth, imgHeight);

            if (i > 0) {
              pdf.addPage();
            }

            pdf.addImage(
              resizedDataURL,
              format,
              xOrdinate,
              yOrdinate,
              imgWidth,
              imgHeight
            );

            const bolbResponse = await fetch(imagePath);
            const blob = await bolbResponse.blob();
            const byteSize = blob.size;
            const kbSize = (byteSize / 1024).toFixed(2);
            //console.log(`Image size: ${kbSize} KB`);
            setImageFileSize(kbSize);

            const pdfBlob = pdf.output("blob");
            const pdfSizeInBytes = pdfBlob.size;
            const pdfSizeInKb = (pdfSizeInBytes / 1024).toFixed(2);
            setPdfFileSize(pdfSizeInKb);

            resolve();
          };

          img.onerror = (err) => reject(err);
        });
      }
    } catch (error) {
      console.error("Error converting images to PDF:", error);
    }
  };

  const handleDownloadPdf = () => {
    if (pdfRef.current) {
      pdfRef.current.save("image-to-pdf.pdf");
    }
  };

  //console.log("image", orgImagePath);
  //console.log("format", resizedQuality/100);

  return (
    <div className="w-full p-2">
      <h1>Image To Pdf</h1>
      <p>
        Convert your images to a PDF document in a few simple steps. Upload one
        or more images, click "Convert to PDF" and download your file.
      </p>
      <p>Supported Images: JPG, JPEG, PNG, WEBP, SVG</p>

      <AddFile />
      {/* <DisplayImage /> */}
      <div
        className={` p-4 ${
          orgImagePath.length > 1
            ? " grid grid-cols-2 lg:grid-cols-6 space-y-4 grid-flow-row items-center"
            : "flex justify-center"
        } `}
      >
        {orgImagePath.map((item, index) => (
          <img
            src={item}
            key={index}
            className={`img-canvas-${index} max-w-36 max-h-36`}
          ></img>
        ))}
      </div>
      <div className=" w-full flex justify-center items-center">
        {orgImagePath.length > 0 && (
          <div className=" flex justify-center items-center">
            {!pdfRef.current && (
              <div className=" flex justify-center items-center">
                <Quality />
                <button
                  onClick={handleImageToPdfBtn}
                  className=" bg-darkPalette-400  p-1 px-2 m-2 rounded-md"
                >
                  Convert to PDF
                </button>
              </div>
            )}
            {pdfFileSize && imageFileSize && (
              <div className=" m-4">
                <h2 className=" font-semibold">Output Info:</h2>
                <p>
                  Image File Size:
                  {imageFileSize > 1024
                    ? `${Math.floor(imageFileSize / 1024)} MB`
                    : `${imageFileSize} KB`}
                </p>
                <p>
                  PDF File Size:
                  {pdfFileSize > 1024
                    ? `${Math.floor(pdfFileSize / 1024)} MB`
                    : `${pdfFileSize} KB`}
                </p>
              </div>
            )}

            { pdfRef.current && <button
              onClick={handleDownloadPdf}
              className={` bg-darkPalette-400 h-fit p-1 m-2 px-2 rounded-md`}
            >
              Download Pdf
            </button>}
          </div>
        )}
      </div>
      <FeaturesSection />
    </div>
  );
}
