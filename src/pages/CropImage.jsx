import React from "react";

import AddFile from "../components/AddFile";
import DisplayImage from "../components/DisplayImage";
import Download from "../components/Download";
import Crop from "../components/Crop";

export default function CropImage() {
  return (
    <div>
      <AddFile />
      <DisplayImage />
<Crop/>
      <Download />
    </div>
  );
}
