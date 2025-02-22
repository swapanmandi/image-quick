import React from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { setOrgImagePath } from "../store/imageSlice.js";

export default function AddFile() {
  const dispatch = useDispatch();
  const editedImagePath = useSelector((state) => state.imageEditing.editedImagePath);

  const onDrop = async (files) => {
    try {
      const filePaths = files.map((item) => {
        
        const filePath = URL.createObjectURL(item);
        dispatch(setOrgImagePath(filePath));
      });

      filePaths.forEach(element => {
        setTimeout(()=>{
          URL.revokeObjectURL(element);
        },5000)
      });
     
    } catch (err) {
      console.log(err);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      {editedImagePath.length == 0 && (
      <div className=" w-full flex justify-center mb-4" {...getRootProps()}>
        <input {...getInputProps()} />
        <div className=" flex justify-center bg-darkPalette-300 w-full min-h-40 p-2 lg:w-1/2 rounded-md items-center">
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>
              Drag 'n' drop file(s) here, or{" "}
              <span className=" font-semibold">click</span> to select file(s)
            </p>
          )}
        </div>
      </div>
      )}
    </>
  );
}
