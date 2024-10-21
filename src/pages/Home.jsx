import React, { useState } from "react";
import AddFile from "../components/AddFile.jsx";
import DisplayImage from "../components/DisplayImage.jsx";
import axios from "axios";
import fileDownload from "js-file-download";

export default function Home() {
  const [editedImagePath, setEditedImagePath] = useState("");
  const [orgImagePath, setOrgImagePath] = useState("");
  const [resizedWidth, setResizedWidth] = useState("");
  const [sizeType, setSizeType] = useState("pixel")
  const [resizedHeight, setResizedHeight] = useState("");
  const [resizedQuality, setResizedQuality] = useState("100");
  const [editedImageSize, setEditedImageSize] = useState("");
  const [rotate, setRotate] = useState(0);

  const handleResizeBtn = () => {
    const img = new Image();
    img.src = orgImagePath;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      console.log("w",img.width)

      if(sizeType === "percentage"){
        canvas.width = (img.width * resizedWidth) / 100;
      canvas.height = (img.height * resizedWidth) / 100;
      } else{
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
        "image/jpeg",
        0.01 * resizedQuality
      );
      const resizedDataUrlLength = resizedDataURL.length;
      const imageSizeInBytes =
        4 * Math.ceil(resizedDataUrlLength / 3) * 0.5624896334383812;
      const imageSizeInKb = (imageSizeInBytes / 1024).toFixed(2);
      //console.log("resized size:", imageSizeInKb)
      setEditedImageSize(imageSizeInKb);
      setEditedImagePath(resizedDataURL);
    };
  };

  const onChange = async (event) => {
    try {
      setOrgImagePath(event)
      //const file = event.target.files[0];
      //const imgPath = URL.createObjectURL(file);
      //setOrgImagePath(imgPath);
      // const image = await resizeFile(file);
      // setEditedImagePath(image);
      //console.log(image);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDownloadImage = () => {
    axios.get(editedImagePath, { responseType: "blob" }).then((res) => {
      fileDownload(res.data, "resizedImg.jpeg");
    });
  };

  console.log("resized path:", editedImagePath)

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
      <button onClick={handleDownloadImage}> Download</button>
    </>
  );
}
