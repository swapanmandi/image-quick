import React, { useEffect, useState } from "react";
import AddFile from "../components/AddFile";
import DisplayImage from "../components/DisplayImage";
import jsPDF from "jspdf";
import { useDispatch, useSelector } from "react-redux";
import html2canvas from "html2canvas";
import { setEditedImagePath, setResizedProgress } from "../store/imageSlice.js";

export default function ImageToPdf() {
  const [imageCanvas, setImageCanvas] = useState(null);
  const [imageCanvasList, setImageCanvasList] = useState([]);

  const dispatch = useDispatch();
  const editedImagePath = useSelector(
    (state) => state.imageEditing.editedImagePath
  );

  const orgImagePath = useSelector((state) => state.imageEditing.orgImagePath);
  const rotate = useSelector((state) => state.imageEditing.rotate);
  const resizedQuality = useSelector(
    (state) => state.imageEditing.resizedQuality
  );

  const pdf = new jsPDF();

  const handleImageToPdfBtn = async () => {
    const totalImages = orgImagePath.length;

    try {
      // Loop through each image path
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
              const imgData = item.toDataURL("image/jpeg", resizedQuality);
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
                //imgWidth = imgWidth * 4.27; // i dont know why width is not print as width so i multiply by 4.27 to get the actual width
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

  console.log("image", orgImagePath);
  return (
    <div>
      <div>ImageToPdf</div>
      <AddFile />
      <DisplayImage setImageCanvas={setImageCanvas} />
      <div className=" image-container "></div>
      {orgImagePath.map((item, index) => (
        <img src={item} key={index} className={`img-canvas-${index}`}></img>
      ))}
      <button onClick={handleImageToPdfBtn}>Convert to PDF</button>
      <button onClick={handleDownloadPdf}>Download Pdf</button>
    </div>
  );
}
