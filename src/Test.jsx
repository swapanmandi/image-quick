import React from 'react'
import jsPDF from 'jspdf';
import { useSelector } from 'react-redux';


export default function Test() {

  const orgImagePath = useSelector(state => state.imageEditing.orgImagePath)
  const convertImageToPdf = (imageSrc) => {
    const doc = new jsPDF();
  
    // Load the image
    doc.addImage(imageSrc, 'JPEG', 10, 10, 100, 100);
  
    // Save the PDF
    doc.save('image.pdf');
  };

  return (
    <div>
      <button onClick={() => convertImageToPdf(orgImagePath[0])}>
  Convert to PDF
</button>
    </div>
  )
}



// const handleResizeBtn = async () => {
//   const totalImages = orgImagePath.length;
//   let resizedCount = 0;
//   const MAX_CONCURRENT_TASKS = 5; // Limit the number of parallel tasks
//   let resizedImages = [];

//   const resizeImage = (item) => {
//     return new Promise((resolve, reject) => {
//       try {
//         const img = new Image();
//         img.src = item;
//         img.onload = () => {
//           const canvas = document.createElement("canvas");
//           const ctx = canvas.getContext("2d");

//           // Resize logic
//           if (sizeType === "percentage") {
//             canvas.width = (img.width * resizedWidth) / 100;
//             canvas.height = (img.height * resizedWidth) / 100;
//           } else {
//             canvas.width = resizedWidth;
//             canvas.height = resizedHeight;
//           }

//           if (rotate) {
//             ctx.translate(canvas.width / 2, canvas.height / 2);
//             ctx.rotate((rotate * Math.PI) / 180);
//             ctx.translate(-canvas.width / 2, -canvas.height / 2);
//           }

//           ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

//           const resizedDataURL = canvas.toDataURL("image/jpeg", 0.01 * resizedQuality);
//           const resizedDataUrlLength = resizedDataURL.length;
//           const imageSizeInBytes = 4 * Math.ceil(resizedDataUrlLength / 3) * 0.5624896334383812;
//           const imageSizeInKb = (imageSizeInBytes / 1024).toFixed(2);

//           resizedImages.push({ filePath: resizedDataURL, fileSize: imageSizeInKb });

//           resizedCount++;
//           const progress = (resizedCount / totalImages) * 100;
//           setResizeProgress(progress); // Update progress in UI

//           resolve(); // Resolve when done
//         };

//         img.onerror = (err) => reject(err); // Handle errors
//       } catch (error) {
//         reject(error);
//       }
//     });
//   };

//   const processBatch = async (batch) => {
//     await Promise.all(batch.map((item) => resizeImage(item)));
//   };

//   try {
//     // Process images in batches of MAX_CONCURRENT_TASKS
//     for (let i = 0; i < totalImages; i += MAX_CONCURRENT_TASKS) {
//       const batch = orgImagePath.slice(i, i + MAX_CONCURRENT_TASKS);
//       await processBatch(batch); // Process each batch
//     }

//     // Update edited image paths at once after processing
//     setEditedImagePath((prev) => [...prev, ...resizedImages]);

//     console.log("All images resized successfully!");
//   } catch (error) {
//     console.error("Error during resizing:", error);
//   }
// };



// convertedPdfCount++;
// const progress = Math.trunc(
//   (convertedPdfCount / totalImages) * 100
// );
// dispatch(setResizedProgress(progress));





