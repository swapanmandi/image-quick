import React, { useState, useCallback } from "react";
import Dropzone, { useDropzone } from "react-dropzone";

export default function AddFile({
  onChange,
  resizedWidth,
  setResizedWidth,
  resizedHeight,
  setResizedHeight,
  onClick,
  resizedQuality,
  setResizedQuality,
  rotate,
  setRotate,
  sizeType,
  setSizeType,
}) {
  const [fs, setFs] = useState([])
 
  const sizeTypes = [
    {label: "pixel", value: "pixel"},
    {label: "percentage", value: "percentage"},
    
  ]
  
  const onDrop = (file) =>{
    onChange(file)
  }

  // const onDrop = useCallback((acceptedFiles) => {
  //   acceptedFiles.forEach((file) => {
  //     setFs(file)
  //     const path = URL.createObjectURL(file);
  //     onChange(path);
  //     const reader = new FileReader();
     
  //     reader.onabort = () => console.log("file reading was aborted");
  //     reader.onerror = () => console.log("file reading has failed");
  //     reader.onload = () => {
  //       // Do whatever you want with the file contents
  //       const binaryStr = reader.result;
  //       //console.log(binaryStr)
  //     };
  //     reader.readAsArrayBuffer(file);
  //   });
  // }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  //console.log(fs);
  return (
    <>
      <div className=" bg-slate-600">Image Resizer</div>

      <div>
        {/* <input type="file" onChange={onChange}></input> */}
        <div {...getRootProps()}>
          <input {...getInputProps()} />

          <div style={{ width: "400px", height: "200px", background: "brown" }}>
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag 'n' drop some files here, or click to select files</p>
            )}
          </div>
        </div>
      </div>
      <div>
        <div>
        {sizeTypes.map(item => (
        
            <label key={item.label}>
          <input value={item.value} onChange={(e) => setSizeType(e.target.value)} type="radio" checked={sizeType === item.value} ></input>
          {item.label}
    
          </label>
          
        ))}
        </div>
        Width:
        <input
          type="number"
          onChange={(e) => setResizedWidth(e.target.value)}
          value={resizedWidth}
        ></input>
        Height:
        <input
          type="number"
          onChange={(e) => setResizedHeight(e.target.value)}
          value={resizedHeight}
        ></input>
        Quality:
        <input
          type="range"
          onChange={(e) => setResizedQuality(e.target.value)}
          value={resizedQuality}
          min="10"
          max="100"
        />
        {resizedQuality}
      </div>
      <div>
        Rotate:
        <input
          id="rotate-input"
          type="number"
          value={rotate}
          onChange={(e) =>
            setRotate(Math.min(270, Math.max(0, Number(e.target.value))))
          }
        />
      </div>
      <button onClick={onClick}>Resize</button>
    </>
  );
}
