import React from "react";
import { useSelector } from "react-redux";

export default function Progress() {
  const resizedProgress = useSelector(
    (state) => state.imageEditing.resizedProgress
  );
  return (
    <div>
      <span>Completed: {resizedProgress} %</span>
    </div>
  );
}
