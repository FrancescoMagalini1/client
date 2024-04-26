import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App.tsx";
import "./index.css";
import "./assets/styles/main.css";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import Home from "./pages/Home.tsx";
import Patients from "./pages/Patients.tsx";
import Folders from "./pages/Folders.tsx";
import Calendar from "./pages/Calendar.tsx";
import Settings from "./pages/Settings.tsx";
import Login from "./pages/Login.tsx";
import Error from "./pages/Error.tsx";
import NewPatient from "./pages/NewPatient.tsx";
import useUserStore from "./stores/userStore.ts";
import db from "./db.ts";
import { user, patient } from "./typescript/types/data.ts";

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

async function patientsLoader() {
  const result = await db.select<patient[]>(
    "SELECT ROWID AS 'id', name, surname, date_of_birth AS 'dateOfBirth', description, photo FROM patients ORDER BY ROWID"
  );
  return result;
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
        loader: patientsLoader,
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
    path: "/new-patient",
    element: <NewPatient />,
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
