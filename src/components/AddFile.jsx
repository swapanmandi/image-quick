import React from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { setOrgImagePath } from "../store/imageSlice.js";


export default function AddFile() {
  const dispatch = useDispatch();
  const orgImagePath = useSelector((state) => state.imageEditing.orgImagePath);

  const onDrop = async (file) => {
    try {
      file.map((item) => {
        const filePath = URL.createObjectURL(item);

        dispatch(setOrgImagePath(filePath));
      });
    } catch (err) {
      console.log(err);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

//console.log("org path", orgImagePath)

  return (
    <div className=" w-full flex justify-center m-2 mb-4" {...getRootProps()}>
      <input {...getInputProps()} />
      <div className=" bg-darkPalette-300 w-full min-h-40 p-2 lg:w-1/2 rounded-md">
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop file(s) here, or <br/> <span className=" font-semibold">click</span> to select file(s)</p>
        )}
      </div>
     
    </div>
  );
}
