import React, { useEffect } from "react";
import Download from "../components/Download";
import AddFile from "../components/AddFile";
import DisplayImage from "../components/DisplayImage";
import { setEditedImagePath } from "../store/imageSlice";
import { useDispatch, useSelector } from "react-redux";

export default function FormatChange() {
  const dispatch = useDispatch();
  const orgImagePath = useSelector((state) => state.imageEditing.orgImagePath);
  const format = useSelector((state) => state.imageEditing.format);
  //   useEffect(() => {
  //     if(orgImagePath.length > 0){
  //        orgImagePath.forEach(path => {
  //         dispatch(setEditedImagePath([{filePath: path, fileSize: 0}]));
  //        });
  //     }
  //   }, [orgImagePath]);

  const handleFormatChange = () => {
    orgImagePath.forEach((path) => {
      const canvas = document.createElement("canvas");
      const img = new Image();
      img.src = path;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const formatedImg = canvas.toDataURL(`imgage/${format}`, 1);
        const formatedImgLength = formatedImg.length;
        const formatedImageSizeInBytes =
          4 * Math.ceil(formatedImgLength / 3) * 0.5624896334383812;
        const formatedImageSizeInKb = (formatedImageSizeInBytes / 1024).toFixed(
          2
        );
        dispatch(
          setEditedImagePath([
            { filePath: formatedImg, fileSize: formatedImageSizeInKb },
          ])
        );
       
      };
    });
  };

  return (
    <div className=" w-full">
      <div>
        <AddFile />
        <DisplayImage />
        <Download />
      </div>
      <div className=" flex justify-center"><button className=" bg-slate-500 p-1 px-2 rounded-md" onClick={handleFormatChange}>Change Format</button></div>
      
    </div>
  );
}
