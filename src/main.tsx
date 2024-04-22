import React from "react";
import ReactDOM from "react-dom/client";
import App from "./assets/pages/App.tsx";
import "./index.css";
import "./assets/styles/main.css";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import Home from "./assets/pages/Home.tsx";
import Patients from "./assets/pages/Patients.tsx";
import Folders from "./assets/pages/Folders.tsx";
import Calendar from "./assets/pages/Calendar.tsx";
import Settings from "./assets/pages/Settings.tsx";
import Login from "./assets/pages/Login.tsx";
import Error from "./assets/pages/Error.tsx";
import useUserStore from "./assets/stores/userStore.ts";
import db from "./db.ts";
import { user } from "./typescript/types/data.ts";

function loginLoader() {
  if (useUserStore.getState().isLoggedIn) return redirect("/");
  return null;
}

async function appLoader() {
  if (!useUserStore.getState().isLoggedIn) {
    const result = await db.select<user[]>(
      "SELECT * FROM users ORDER BY id LIMIT 1"
    );
    if (result.length) {
      useUserStore.getState().login(result[0]);
    } else {
      return redirect("/login");
    }
  }
  return null;
}

const router = createBrowserRouter([
  {
    path: "/",
    loader: appLoader,
    errorElement: <Error />,
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
  {
    path: "/login",
    loader: loginLoader,
    element: <Login />,
  },
  {
    path: "/error",
    element: <Error />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
