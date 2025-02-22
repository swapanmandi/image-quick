import React, { useRef, useState, useEffect } from "react";
import AddFile from "../components/AddFile";
import jsPDF from "jspdf";
import { useDispatch, useSelector } from "react-redux";
import { Stage, Layer, Line } from "react-konva";
import {
  clearEditedImagePath,
  clearOrgImagePath,
} from "../store/imageSlice.js";
import FeaturesSection from "../components/FeaturesSection.jsx";
import Quality from "../components/Quality.jsx";
import { useLocation } from "react-router-dom";
import PdfCustomize from "../components/PdfCustomize.jsx";

export default function ImageToPdf() {
  const [pdfFileSize, setPdfFileSize] = useState("");
  const [imageFileSize, setImageFileSize] = useState("");
  const [resiuality, setResizedQuality] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [pdfImages, setPdfImages] = useState([]);
  const [isClickCustomize, setIsClickCustomize] = useState(false);
  const [isSavePdf, setIsSavePdf] = useState(false);
  const [guidelines, setGuidelines] = useState([]);
  const [pdfSettings, setPdfSettings] = useState({
    orientation: "portrait",
    pageSize: "a4",
    margin: "small",
    backgroundClr: "#ffffff",
  });

  const handlePdfSettings = (e) => {
    const { name, value } = e.target;
    setPdfSettings((prev) => ({ ...prev, [name]: value }));
  };

  const location = useLocation();
  const orgImagePath = useSelector((state) => state.imageEditing.orgImagePath);

  const dispatch = useDispatch();
  const resizedQuality = useSelector(
    (state) => state.imageEditing.resizedQuality
  );
  const format = useSelector((state) => state.imageEditing.format);

  const pdfRef = useRef();
  const stageRef = useRef();
  const handleSelect = (id) => setSelectedId(id);

  const handleChange = (id, newAttrs) => {
    const newImages = pdfImages.map((img) =>
      img.id === id ? { ...img, ...newAttrs } : img
    );
    setPdfImages(newImages);
  };

  useEffect(() => {
    orgImagePath.map((img) => {
      const newId = new Date().getTime();
      const imgObj = {
        id: newId,
        src: img,
        x: 100,
        y: 100,
        width: 150,
        height: 150,
        rotation: 0,
      };
      setPdfImages([...pdfImages, imgObj]);
    });
  }, [orgImagePath]);

  const handleImageToPdfBtn = async () => {
    const pdf = new jsPDF(pdfSettings.orientation, "mm", pdfSettings.pageSize);
    pdfRef.current = pdf;
    const totalImages = orgImagePath.length;

    try {
      for (let i = 0; i < totalImages; i++) {
        const imagePath = orgImagePath[i];
        const img = new Image();
        img.src = imagePath;

        await new Promise((resolve, reject) => {
          img.onload = async () => {
            // const imageContainer = document.querySelector(`.img-canvas-${i}`);

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const resizedDataURL = canvas.toDataURL(
              `image/${format}`,
              0.01 * resizedQuality
            );

            let xOrdinate = 12.7; // IN MM
            let yOrdinate = 12.7; // IN MM
            let imgWidth = (canvas.width / 72) * 25.4; // IN MM
            let imgHeight = (canvas.height / 72) * 25.4; // IN MM
            //const pageHeight = pdf.internal.pageSize.height; // IN MM
            //const pageWidth = pdf.internal.pageSize.width; // IN MM

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

            //  console.log("imgWidth-imgHeight", img.width, img.height);
            //  console.log("w-h", imgWidth, imgHeight);

            if (i > 0) {
              pdf.addPage();
            }

            pdf.addImage(
              resizedDataURL,
              format,
              xOrdinate,
              yOrdinate,
              imgWidth,
              imgHeight
            );

            const bolbResponse = await fetch(imagePath);
            const blob = await bolbResponse.blob();

            const byteSize = blob.size;
            const kbSize = (byteSize / 1024).toFixed(2);
            //console.log(`Image size: ${kbSize} KB`);
            setImageFileSize(kbSize);

            const pdfBlob = pdf.output("blob");
            const pdfSizeInBytes = pdfBlob.size;
            const pdfSizeInKb = (pdfSizeInBytes / 1024).toFixed(2);
            setPdfFileSize(pdfSizeInKb);

            resolve();
          };

          img.onerror = (err) => reject(err);
        });
      }
    } catch (error) {
      console.error("Error converting images to PDF:", error);
    }
  };

  const handleDownloadPdf = () => {
    if (!stageRef.current && pdfRef.current) {
      pdfRef.current.save("image-to-pdf.pdf");
    } else {
      const stage = stageRef.current;
      const dataURL = stage.toDataURL({
        pixelRatio: 2,
        mimeType: "image/png",
        quality: 0.7,
      });

      const pdf = new jsPDF(
        pdfSettings.orientation,
        "mm",
        pdfSettings.pageSize,
        true
      );
      pdf.addImage(dataURL, "PNG", 0, 0, 210, 297, "", "FAST");
      pdf.save("converted-image.pdf");
    }
  };

  useEffect(() => {
    if (location.pathname) {
      dispatch(clearEditedImagePath());
    }
  }, [location.pathname]);

  const handleClickCustomize = () => {
    setIsClickCustomize(true);
    dispatch(clearEditedImagePath());
    dispatch(clearOrgImagePath());
  };

  // Function to handle dragging
  const handleDragMove = (e) => {
    const node = e.target;
    const stage = node.getStage();
    const stageWidth = stage.width();
    const stageHeight = stage.height();
    const imageX = node.x();
    const imageY = node.y();
    const imageWidth = node.width();
    const imageHeight = node.height();

    const newGuidelines = [];

    // Vertical (Y-Axis) guideline (Center)
    if (Math.abs(imageX + imageWidth / 2 - stageWidth / 2) < 10) {
      newGuidelines.push({
        points: [stageWidth / 2, 0, stageWidth / 2, stageHeight],
      });
    }

    // Horizontal (X-Axis) guideline (Center)
    if (Math.abs(imageY + imageHeight / 2 - stageHeight / 2) < 10) {
      newGuidelines.push({
        points: [0, stageHeight / 2, stageWidth, stageHeight / 2],
      });
    }

    setGuidelines(newGuidelines);
  };

  // Remove guidelines when drag ends
  const handleDragEnd = () => {
    setGuidelines([]);
  };

  const handleCancelBtn = () => {
    dispatch(clearOrgImagePath());
    dispatch(clearEditedImagePath());
    setPdfImages([]);
    setIsClickCustomize(false);
    setIsSavePdf(false);
    setPdfFileSize("");
    setImageFileSize("");
    pdfRef.current = undefined;
    window.scrollTo(0, 0);
  };

  const maxWidth = 300;
  const scaleFactor =
    maxWidth / (pdfSettings.orientation === "portrait" ? 595 : 842);

  return (
    <div className="w-full p-2">
      <h1 className=" text-2xl place-self-center">Image To Pdf</h1>

      <AddFile />

      <div
        className={`${
          orgImagePath.length > 1
            ? " grid grid-cols-2 lg:grid-cols-6 space-y-4 grid-flow-row items-center"
            : "flex flex-col justify-center items-center"
        } `}
      >
        {!isClickCustomize &&
          orgImagePath.map((item, index) => (
            <div
              className={`${
                pdfSettings.orientation === "portrait"
                  ? "w-36 h-[203px]"
                  : " w-[203px] h-36"
              } flex justify-center items-center bg-[${
                pdfSettings.backgroundClr
              }]  m-2`}
              key={index}
            >
              <img
                src={item}
                alt=""
                className={` img-canvas-${index} ${
                  pdfSettings.orientation === "portrait"
                    ? "w-32 h-48"
                    : " w-24 h-32"
                }`}
              ></img>
            </div>
          ))}

        {isClickCustomize && (
          <div
            className={` w-full flex flex-col justify-center items-center overflow-hidden`}
          >
            <Stage
              width={
                (pdfSettings.orientation === "portrait" ? 595 : 842) *
                scaleFactor
              }
              height={
                (pdfSettings.orientation === "portrait" ? 842 : 595) *
                scaleFactor
              }
              ref={stageRef}
              style={{
                border: "1px solid black",
                backgroundColor: pdfSettings.backgroundClr,
              }}
              onMouseDown={(e) => {
                if (e.target === e.target.getStage()) setSelectedId(null);
              }}
            >
              <Layer>
                {guidelines.map((line, index) => (
                  <Line
                    key={index}
                    points={line.points}
                    stroke="red"
                    strokeWidth={1}
                    dash={[5, 5]}
                  />
                ))}
                {pdfImages.map((img) => (
                  <PdfCustomize
                    setGuidelines={setGuidelines}
                    key={img.id}
                    imageUrl={img.src}
                    shapeProps={img}
                    isSelected={img.id === selectedId}
                    onSelect={() => handleSelect(img.id)}
                    onChange={(newAttrs) => handleChange(img.id, newAttrs)}
                    handleDragEnd={handleDragEnd}
                    handleDragMove={handleDragMove}
                  />
                ))}
              </Layer>
            </Stage>
            {!isSavePdf && (
              <button
                onClick={() => setIsSavePdf(true)}
                className=" bg-cyan-400 p-2 rounded-md h-fit m-4 place-self-center"
              >
                Save
              </button>
            )}
          </div>
        )}

        {/* pdf settings */}
        {(orgImagePath.length >= 1 || pdfImages.length >= 1) && (
          <div className=" overflow-hidden w-full flex flex-col justify-center items-center">
            <form>
              <fieldset className=" w-full flex flex-col lg:flex-row p-2 justify-around my-4">
                <div>
                  <label className=" font-semibold">Page Orientation:</label>
                  <select
                    onChange={handlePdfSettings}
                    className=" text-black bg-slate-500  rounded-sm p-1 m-2 outline-none"
                    name="orientation"
                  >
                    <option value="portrait">Portraiat</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
                <div>
                  <label className=" font-semibold">Page Size:</label>
                  <select
                    className=" text-black bg-slate-500  rounded-sm p-1 m-2 outline-none"
                    onChange={handlePdfSettings}
                    name="pageSize"
                  >
                    <option value="a4">A4</option>
                    <option value="letter">Letter</option>
                    <option value="a3">A3</option>
                    <option value="Legal">Legal</option>
                    <option value="a5">A5</option>
                  </select>
                </div>
                <div>
                  <div>
                    <label className=" font-semibold">Margin:</label>
                    <select
                      className=" text-black bg-slate-500  rounded-sm p-1 m-2 outline-none"
                      onChange={handlePdfSettings}
                      name="margin"
                    >
                      <option value="small">Small</option>
                      <option value="no">No Margin</option>
                      <option value="big">Big</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className=" font-semibold">Background Color:</label>
                  <select
                    className=" text-black bg-slate-500  rounded-sm p-1 m-2 outline-none"
                    onChange={handlePdfSettings}
                    name="backgroundClr"
                  >
                    <option value="#ffffff">Default</option>
                    <option value="#f5f5f5">Light Gray </option>
                    <option value="#faf3e0">Soft Beige</option>
                    <option value="#121212">Deep Gray</option>
                  </select>
                </div>
              </fieldset>
            </form>
            <button
              onClick={handleCancelBtn}
              className=" bg-red-400 p-2 rounded-md h-fit m-4 place-self-center"
            >
              Cancel
            </button>
          </div>
        )}

        {!isClickCustomize && orgImagePath.length === 1 && !pdfRef.current && (
          <button
            className=" bg-cyan-400 p-2 rounded-md h-fit m-4 mb-6 place-self-center"
            onClick={handleClickCustomize}
          >
            Customize
          </button>
        )}
      </div>

      <div className=" w-full flex justify-center items-center">
        {orgImagePath.length > 0 && !isClickCustomize && (
          <div className=" flex justify-center items-center">
            {!pdfRef.current && (
              <div className=" flex justify-center items-center">
                <Quality />
                <button
                  onClick={handleImageToPdfBtn}
                  className=" bg-darkPalette-400  p-1 px-2 m-2 rounded-md"
                >
                  Convert to PDF
                </button>
              </div>
            )}
            {pdfFileSize && imageFileSize && (
              <div className=" m-4">
                <h2 className=" font-semibold">Output Info:</h2>
                <p>
                  Image File Size:
                  {imageFileSize > 1024
                    ? `${Math.floor(imageFileSize / 1024)} MB`
                    : `${imageFileSize} KB`}
                </p>
                <p>
                  PDF File Size:
                  {pdfFileSize > 1024
                    ? `${Math.floor(pdfFileSize / 1024)} MB`
                    : `${pdfFileSize} KB`}
                </p>
              </div>
            )}
          </div>
        )}

        {(isSavePdf || pdfRef.current) && (
          <button
            onClick={handleDownloadPdf}
            className={` bg-darkPalette-400 h-fit p-1 m-2 px-2 rounded-md`}
          >
            Download Pdf
          </button>
        )}
      </div>
      <div className=" w-full flex flex-col justify-center items-center pt-14">
        <p>
          Convert your images to a PDF document in a few simple steps. Upload
          one or more images, click "Convert to PDF" and download your file.
        </p>
        <p>Supported Images: JPG, JPEG, PNG, WEBP, SVG</p>
      </div>
    </div>
  );
}
