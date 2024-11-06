import React from 'react'

export default function Test() {
  return (
    <div>Test</div>
  )
}



const handleResizeBtn = async () => {
  const totalImages = orgImagePath.length;
  let resizedCount = 0;
  const MAX_CONCURRENT_TASKS = 5; // Limit the number of parallel tasks
  let resizedImages = [];

  const resizeImage = (item) => {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image();
        img.src = item;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Resize logic
          if (sizeType === "percentage") {
            canvas.width = (img.width * resizedWidth) / 100;
            canvas.height = (img.height * resizedWidth) / 100;
          } else {
            canvas.width = resizedWidth;
            canvas.height = resizedHeight;
          }

          if (rotate) {
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotate * Math.PI) / 180);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
          }

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const resizedDataURL = canvas.toDataURL("image/jpeg", 0.01 * resizedQuality);
          const resizedDataUrlLength = resizedDataURL.length;
          const imageSizeInBytes = 4 * Math.ceil(resizedDataUrlLength / 3) * 0.5624896334383812;
          const imageSizeInKb = (imageSizeInBytes / 1024).toFixed(2);

          resizedImages.push({ filePath: resizedDataURL, fileSize: imageSizeInKb });

          resizedCount++;
          const progress = (resizedCount / totalImages) * 100;
          setResizeProgress(progress); // Update progress in UI

          resolve(); // Resolve when done
        };

        img.onerror = (err) => reject(err); // Handle errors
      } catch (error) {
        reject(error);
      }
    });
  };

  const processBatch = async (batch) => {
    await Promise.all(batch.map((item) => resizeImage(item)));
  };

  try {
    // Process images in batches of MAX_CONCURRENT_TASKS
    for (let i = 0; i < totalImages; i += MAX_CONCURRENT_TASKS) {
      const batch = orgImagePath.slice(i, i + MAX_CONCURRENT_TASKS);
      await processBatch(batch); // Process each batch
    }

    // Update edited image paths at once after processing
    setEditedImagePath((prev) => [...prev, ...resizedImages]);

    console.log("All images resized successfully!");
  } catch (error) {
    console.error("Error during resizing:", error);
  }
};




const convertedImgData = canvas.toDataURL(
  "image/jpeg",
  0.01 * resizedQuality
);

html2canvas(canvas).then((item) => {
  pdf.addImage(
    convertedImgData,
    "JPEG",
    10,
    0,
    item.width,
    item.height
  );
});
const convertedDataUrlLength = convertedImgData.length;
const imageSizeInBytes =
  4 * Math.ceil(convertedDataUrlLength / 3) * 0.5624896334383812;
const pdfSizeInKb = (imageSizeInBytes / 1024).toFixed(2);



convertedPdfCount++;
const progress = Math.trunc(
  (convertedPdfCount / totalImages) * 100
);
dispatch(setResizedProgress(progress));





