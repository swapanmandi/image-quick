import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import ResizeImage from "./pages/ResizeImage.jsx";
import CropImage from "./pages/CropImage.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import ImageToPdf from "./pages/ImageToPdf.jsx";
import FormatChange from "./pages/FormatChange.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {path: "/",
        element: <Home/>
      },
      {
        path: "/resize",
        element: <ResizeImage />,
      },
      {
        path: "/crop",
        element: <CropImage />,
      },
      {
        path: "/imagetopdf",
        element: <ImageToPdf/>
      },
      {
        path: "/format-change",
        element: <FormatChange/>
      }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </StrictMode>
);
