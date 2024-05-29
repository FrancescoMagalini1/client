import "../assets/styles/patient.css";
import { useLoaderData, Link, useNavigate } from "react-router-dom";
import { patient } from "../typescript/types/data";
import ArrowLeftIcon from "../components/icons/ArrowLeftIcon";
import Avatar from "boring-avatars";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { colors } from "../utils";
import { format } from "date-fns";

function Patient() {
  const patient = useLoaderData() as patient | undefined;
  const genderFormatted = patient
    ? patient.gender == "F"
      ? "Female"
      : patient.gender == "M"
      ? "Male"
      : "Other"
    : "";
  let navigate = useNavigate();

  return (
    <div id="patient">
      {patient ? (
        <>
          <div className="header">
            <button onClick={() => navigate(-1)}>
              <ArrowLeftIcon />
            </button>
          </div>
          <div className="content">
            <div className="avatar">
              {patient.photo ? (
                <>
                  <img src={convertFileSrc(patient.photo)} />
                </>
              ) : (
                <Avatar
                  name={patient.name + " " + patient.surname}
                  colors={colors}
                  variant="beam"
                  size="100%"
                />
              )}
            </div>
            <h1>
              {patient.name} {patient.surname}
            </h1>
            <h3>Date of Birth</h3>
            <p>{format(new Date(patient.dateOfBirth), "d MMMM yyyy")}</p>
            <h3>Gender</h3>
            <p>{genderFormatted}</p>
            <h3>Description</h3>
            <p>{patient.description || "None"}</p>
            <Link to={`/patients/${patient.id}/edit`}>Edit Patient</Link>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Patient;
