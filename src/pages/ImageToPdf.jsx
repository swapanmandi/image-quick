import React, { useState } from "react";
import AddFile from "../components/AddFile";
import DisplayImage from "../components/DisplayImage";
import jsPDF from "jspdf";
import { useSelector } from "react-redux";
import html2canvas from "html2canvas";

export default function ImageToPdf() {
  const [imageCanvas, setImageCanvas] = useState(null);

  const editedImagePath = useSelector(
    (state) => state.imageEditing.editedImagePath
  );
  const pdf = new jsPDF();

  console.log("img canvas", imageCanvas)

  html2canvas(imageCanvas).then((canvas) => {
    const imgData = canvas.toDataURL("image/jpeg");
    const imgWidth = 150;
    const pageHeight = pdf.internal.pageSize.height;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let position = pageHeight/2 - imgHeight/2;
    pdf.addImage(imgData, "JPEG", 10, position, imgWidth, imgHeight);
  });

  const handleDownloadPdf = () => {
    pdf.save("image-to-pdf.pdf");
  };
  return (
    <div>
      <div>ImageToPdf</div>
      <AddFile />
      <DisplayImage setImageCanvas={setImageCanvas} />
      <button onClick={handleDownloadPdf}>Download Pdf</button>
    </div>
  );
}
