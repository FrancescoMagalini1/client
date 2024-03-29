import React from "react";
import ReactDOM from "react-dom/client";
import App from "./assets/pages/App.tsx";
import "./index.css";
import "./assets/styles/main.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./assets/pages/Home.tsx";
import Patients from "./assets/pages/Patients.tsx";
import Folders from "./assets/pages/Folders.tsx";
import Calendar from "./assets/pages/Calendar.tsx";
import Settings from "./assets/pages/Settings.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <Home />,
        index: true,
      },
      {
        path: "patients",
        element: <Patients />,
      },
      {
        path: "folders",
        element: <Folders />,
      },
      {
        path: "calendar",
        element: <Calendar />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
