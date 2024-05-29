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
import Appointment from "./pages/Appointment.tsx";
import NewAppointment from "./pages/NewAppointment.tsx";
import useUserStore from "./stores/userStore.ts";
import db from "./db.ts";
import {
  user,
  patient,
  appointmentSQLite,
  appointment,
} from "./typescript/types/data.ts";

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

async function patientLoader({ params }: { params: Params<"patientId"> }) {
  const result = await db.select<patient[]>(
    "SELECT ROWID AS 'id', name, surname, date_of_birth AS 'dateOfBirth', gender, description, photo FROM patients WHERE ROWID=$1",
    [params.patientId]
  );
  if (!result.length) return redirect("/error");
  return result[0];
}

async function appointmentLoader({
  params,
}: {
  params: Params<"appointmentId">;
}) {
  const result = await db.select<appointmentSQLite[]>(
    `SELECT ROWID AS 'id', start_datetime AS 'startDateTime', end_datetime AS 'endDateTime', description, (
      SELECT json_group_array(json_object('id', patients.ROWID, 'name', patients.name, 'surname', patients.surname, 
      'dateOfBirth', patients.date_of_birth, 'gender', patients.gender, 'description', patients.description, 'photo', patients.photo)) 
      FROM json_each(appointments.patients) INNER JOIN patients ON patients.ROWID = json_each.value
      ) AS "patients" 
      FROM appointments WHERE ROWID=$1`,
    [params.appointmentId]
  );
  if (!result.length) return redirect("/error");
  return result.map((x) => ({ ...x, patients: JSON.parse(x.patients) }))[0];
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
        path: "appointments/:appointmentId",
        loader: appointmentLoader,
        element: <Appointment />,
      },
      {
        path: "appointments/:appointmentId/edit",
        loader: appointmentLoader,
        element: <NewAppointment />,
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
