import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App.tsx";
import "./index.css";
import "./assets/styles/main.css";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
  Params,
  LoaderFunctionArgs,
} from "react-router-dom";
import Home from "./pages/Home.tsx";
import Patients from "./pages/Patients.tsx";
import Folders from "./pages/Folders.tsx";
import Calendar from "./pages/Calendar.tsx";
import Settings from "./pages/Settings.tsx";
import Login from "./pages/Login.tsx";
import Error from "./pages/Error.tsx";
import User from "./pages/User.tsx";
import Patient from "./pages/Patient.tsx";
import NewPatient from "./pages/NewPatient.tsx";
import NewAppointment from "./pages/NewAppointment.tsx";
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

async function patientsLoader({ request }: LoaderFunctionArgs) {
  const usersPerPage = 12;
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";
  let q = query;
  if (q) q = "%" + q + "%";
  let result2;
  if (q) {
    result2 = await db.select<{ n: number }[]>(
      "SELECT COUNT(*) AS n FROM patients_fts WHERE name LIKE $1 OR surname LIKE $1 OR description LIKE $1",
      [q]
    );
  } else {
    result2 = await db.select<{ n: number }[]>(
      "SELECT COUNT(*) AS n FROM patients"
    );
  }
  let pages = Math.ceil(result2[0].n / usersPerPage);
  let currentPage = parseInt(url.searchParams.get("page") ?? "1");
  currentPage = isNaN(currentPage) ? 1 : currentPage;
  currentPage = Math.min(Math.max(currentPage, 1), pages) || 1;
  let result1;
  if (q) {
    result1 = await db.select<patient[]>(
      `SELECT patients.ROWID AS 'id', patients.name, patients.surname, patients.date_of_birth AS 'dateOfBirth', 
      patients.gender, patients.description, patients.photo
      FROM patients INNER JOIN patients_fts ON patients.ROWID = patients_fts.ROWID
      WHERE patients_fts.name LIKE $1 OR patients_fts.surname LIKE $1 OR patients_fts.description LIKE $1
      ORDER BY rank LIMIT $2 OFFSET $3`,
      [q, usersPerPage, usersPerPage * (currentPage - 1)]
    );
  } else {
    result1 = await db.select<patient[]>(
      `SELECT ROWID AS 'id', name, surname, date_of_birth AS 'dateOfBirth', gender, description, photo 
      FROM patients ORDER BY ROWID LIMIT $1 OFFSET $2`,
      [usersPerPage, usersPerPage * (currentPage - 1)]
    );
  }

  return {
    patients: result1,
    pages,
    current: currentPage,
    query,
  };
}

async function patientLoader({ params }: { params: Params<"patientId"> }) {
  const result = await db.select<patient[]>(
    "SELECT ROWID AS 'id', name, surname, date_of_birth AS 'dateOfBirth', gender, description, photo FROM patients WHERE ROWID=$1",
    [params.patientId]
  );
  if (!result.length) return redirect("/error");
  return result[0];
}

const router = createBrowserRouter([
  {
    path: "/",
    loader: appLoader,
    errorElement: <Error />,
    element: <User />,
    children: [
      {
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
        path: "patients/new",
        element: <NewPatient />,
      },
      {
        path: "patients/:patientId",
        loader: patientLoader,
        element: <Patient />,
      },
      {
        path: "patients/:patientId/edit",
        loader: patientLoader,
        element: <NewPatient />,
      },
      {
        path: "appointments/new",
        element: <NewAppointment />,
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
