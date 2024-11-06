import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orgImagePath: [],
  editedImagePath: [],
  resizedWidth: "",
  resizedHeight: "",
  resizedQuality: "100",
  rotate: 0,
  format: "jpeg",
  resizedProgress: 0,
  sizeType: "pixel",
};

const imageSlice = createSlice({
  name: "imageEditing",
  initialState,
  reducers: {
    setOrgImagePath: (state, action) => {
      state.orgImagePath.push(action.payload);
    },
    setEditedImagePath: (state, action) => {
      state.editedImagePath = [...state.editedImagePath, ...action.payload];
    },
    setResizedWidth: (state, action) => {
      state.resizedWidth = action.payload;
    },
    setResizedHeight: (state, action) => {
      state.resizedHeight = action.payload;
    },
    setRotate: (state, action) => {
      state.rotate = action.payload;
    },
    setFormat: (state, action) => {
      state.format = action.payload;
    },
    setResizedQuality: (state, action) => {
      state.resizedQuality = action.payload;
    },
    setSizeType: (state, action) => {
      state.sizeType = action.payload;
    },
    setResizedProgress: (state, action) => {
      state.resizedProgress = action.payload;
    },
  },
});

export const {
  setOrgImagePath,
  setEditedImagePath,
  setResizedWidth,
  setResizedHeight,
  setRotate,
  setFormat,
  setResizedQuality,
  setSizeType,
  setResizedProgress,
} = imageSlice.actions;

export default imageSlice.reducer;