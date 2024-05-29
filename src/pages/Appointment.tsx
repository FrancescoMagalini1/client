import "../assets/styles/appointment.css";
import { useLoaderData, Link, useNavigate } from "react-router-dom";
import { appointment } from "../typescript/types/data";
import ArrowLeftIcon from "../components/icons/ArrowLeftIcon";
import { format, isSameDay } from "date-fns";

function Appointment() {
  const appointment = useLoaderData() as appointment | undefined;
  let navigate = useNavigate();
  return (
    <div id="appointment">
      {appointment ? (
        <>
          <div className="header">
            <button onClick={() => navigate(-1)}>
              <ArrowLeftIcon />
            </button>
          </div>
          <div className="content">
            <h3>Time</h3>
            <p>
              {isSameDay(appointment.startDateTime, appointment.endDateTime)
                ? `${format(
                    appointment.startDateTime,
                    "eeee, d MMMM yyyy | HH:mm"
                  )} - ${format(appointment.endDateTime, "HH:mm")}`
                : `${format(
                    appointment.startDateTime,
                    "eeee, d MMMM yyyy  HH:mm"
                  )} - ${format(
                    appointment.endDateTime,
                    "eeee, d MMMM yyyy  HH:mm"
                  )}`}
            </p>
            <h3>Patient{appointment.patients.length > 1 ? "s" : ""}</h3>
            <div className="patients">
              {appointment.patients.map((patient) => (
                <Link to={`/patients/${patient.id}`} key={patient.id}>
                  {patient.name + " " + patient.surname}
                </Link>
              ))}
            </div>
            <h3>Description</h3>
            <p>{appointment.description || "None"}</p>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Appointment;
