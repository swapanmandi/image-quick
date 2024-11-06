import { configureStore } from "@reduxjs/toolkit";
import imageReducer from "./imageSlice.js";

export const store = configureStore({
  reducer: {
    imageEditing: imageReducer,
  },
});
