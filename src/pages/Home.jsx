import React, { useState } from "react";
import AddFile from "../components/AddFile.jsx";
import Resizer from "react-image-file-resizer";
import DisplayImage from "../components/DisplayImage.jsx";
import axios from "axios";
import fileDownload from "js-file-download";

export default function Home() {
  const [editedImagePath, setEditedImagePath] = useState("");
  const [orgImagePath, setOrgImagePath] = useState("");
  const [resizedWidth, setResizedWidth] = useState("");
  const [resizedHeight, setResizedHeight] = useState("");
  const [resizedQuality, setResizedQuality] = useState("100");
const [editedImageSize, setEditedImageSize] = useState("")


  const handleResizeBtn = () => {
    const img = new Image();
    img.src = orgImagePath;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = resizedWidth;
      canvas.height = resizedHeight;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const resizedDataURL = canvas.toDataURL("image/jpeg", 0.01 * resizedQuality);
      const resizedDataUrlLength = resizedDataURL.length;
      const imageSizeInBytes = 4 * Math.ceil(resizedDataUrlLength / 3) * 0.5624896334383812;
      const imageSizeInKb = (imageSizeInBytes/1024).toFixed(2)
      //console.log("resized size:", imageSizeInKb)
      setEditedImageSize(imageSizeInKb)
      setEditedImagePath(resizedDataURL);
    };
  };

  const onChange = async (event) => {
    try {
      const file = event.target.files[0];
      const imgPath = URL.createObjectURL(file);
      setOrgImagePath(imgPath);
      // const image = await resizeFile(file);
      // setEditedImagePath(image);
      //console.log(image);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDownloadImage = () => {
    axios.get(editedImagePath, { responseType: "blob" }).then((res) => {
      fileDownload(res.data, "resizedImg.png");
    });
  };

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
      />
      <img src={orgImagePath} height={300} width={250}></img>
      <DisplayImage imgUrl={editedImagePath} editedImageSize={editedImageSize} resizedWidth={resizedWidth} resizedHeight={resizedHeight} />

      <button onClick={handleDownloadImage}> Download</button>
    </>
  );
}
