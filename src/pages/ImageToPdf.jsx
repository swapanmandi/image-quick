import React, { useEffect, useState } from "react";
import AddFile from "../components/AddFile";
import DisplayImage from "../components/DisplayImage";
import jsPDF from "jspdf";
import { useDispatch, useSelector } from "react-redux";
import html2canvas from "html2canvas";
import { setEditedImagePath, setResizedProgress } from "../store/imageSlice.js";

export default function ImageToPdf() {
  const [pdfFileSize, setPdfFileSize] = useState("");
  const dispatch = useDispatch();
  const editedImagePath = useSelector(
    (state) => state.imageEditing.editedImagePath
  );

  const orgImagePath = useSelector((state) => state.imageEditing.orgImagePath);
  const rotate = useSelector((state) => state.imageEditing.rotate);
  const resizedQuality = useSelector(
    (state) => state.imageEditing.resizedQuality
  );
  const format = useSelector((state) => state.imageEditing.format);
  const pdf = new jsPDF();

  const handleImageToPdfBtn = async () => {
    const totalImages = orgImagePath.length;

    try {
      for (let i = 0; i < totalImages; i++) {
        const imagePath = orgImagePath[i];
        const img = new Image();
        img.src = imagePath;

        await new Promise((resolve, reject) => {
          img.onload = () => {
            const imageContainer = document.querySelector(`.img-canvas-${i}`);

            //const imgCanvas = imageContainer.appendChild(img);
            //console.log("canvas", imgCanvas);

            console.log("container", imageContainer);
            html2canvas(imageContainer).then((item) => {
              const imgData = item.toDataURL(`image/${format}`, resizedQuality);
              let xOrdinate = 12.7; // IN MM
              let yOrdinate = 12.7; // IN MM
              let imgWidth = (img.width / 72) * 25.4; // IN MM
              let imgHeight = (img.height / 72) * 25.4; // IN MM
              const pageHeight = pdf.internal.pageSize.height; // IN MM
              const pageWidth = pdf.internal.pageSize.width; // IN MM

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

              console.log("imgWidth-img-height", imgWidth, imgHeight);
              //console.log("x", pageWidth);

              if (i > 0) {
                pdf.addPage();
              }

              pdf.addImage(
                imgData,
                "JPEG",
                xOrdinate,
                yOrdinate,
                imgWidth,
                imgHeight
              );
              //document.body.removeChild(imageContainer);

              const pdfBlob = pdf.output("blob");
              const imageSizeInBytes = pdfBlob.size;
              const imageSizeInKb = (imageSizeInBytes / 1024).toFixed(2);
              setPdfFileSize(imageSizeInKb);

              resolve();
            });
          };

          img.onerror = (err) => reject(err);
        });
      }
    } catch (error) {
      console.error("Error converting images to PDF:", error);
    }
  };

  const handleDownloadPdf = () => {
    pdf.save("image-to-pdf.pdf");
  };

  //console.log("image", orgImagePath);
  return (
    <div className=" w-full">
      <div>ImageToPdf</div>
      <AddFile />
      <DisplayImage />
      <div className={` p-4 ${orgImagePath.length>1 ? " grid grid-cols-6 space-y-4 grid-flow-row items-center" : "flex justify-center"} `}>
        {orgImagePath.map((item, index) => (
          <img
            src={item}
            key={index}
            className={`img-canvas-${index} w-36 h-36`}
          ></img>
        ))}
      </div>
      <div className="w-full  flex justify-center">
        {orgImagePath.length > 0 && (
          <div>
            <button onClick={handleImageToPdfBtn} className=" bg-slate-500 p-1 px-2 rounded-md">Convert to PDF</button>
            <p>
              PDF File Size:
              {pdfFileSize > 1024
                ? `${Math.floor(pdfFileSize / 1024)} MB.`
                : `${pdfFileSize} KB.`}
            </p>
            <button onClick={handleDownloadPdf} className=" bg-slate-500 p-1 px-2 rounded-md">Download Pdf</button>
          </div>
        )}
      </div>
    </div>
  );
}
