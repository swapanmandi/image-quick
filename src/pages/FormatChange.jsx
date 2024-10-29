import React, { useEffect } from "react";
import Download from "../components/Download";
import AddFile from "../components/AddFile";
import DisplayImage from "../components/DisplayImage";
import { setEditedImagePath } from "../store/imageSlice";
import { useDispatch, useSelector } from "react-redux";

export default function FormatChange() {
  const dispatch = useDispatch();
  const orgImagePath = useSelector((state) => state.imageEditing.orgImagePath);
  const format = useSelector(state => state.imageEditing.format)
  //   useEffect(() => {
  //     if(orgImagePath.length > 0){
  //        orgImagePath.forEach(path => {
  //         dispatch(setEditedImagePath([{filePath: path, fileSize: 0}]));
  //        });
  //     }
  //   }, [orgImagePath]);

  useEffect(() => {
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
        dispatch(setEditedImagePath([{ filePath: formatedImg, fileSize: 0 }]));
      };
    });
  }, [orgImagePath]);

  return (
    <div>
      <div>
        <AddFile />
        <DisplayImage />
        <Download />
      </div>
    </div>
  );
}
