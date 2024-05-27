import "../assets/styles/calendar.css";
import { useState, useEffect } from "react";
import NavArrowLeftIcon from "../components/icons/NavArrowLeftIcon";
import NavArrowRightIcon from "../components/icons/NavArrowRightIcon";
import NavArrowDownIcon from "../components/icons/NavArrowDownIcon";
import { format, subDays, addDays, differenceInCalendarDays } from "date-fns";
import { Link } from "react-router-dom";
import useAppStore from "../stores/appStore";

function Calendar() {
  let [date, setDate] = useState(new Date());
  let appointments = [];
  const setCalendarDate = useAppStore((state) => state.setCalendarDate);

  useEffect(() => {
    setCalendarDate(date);
  }, [date]);

  function _noAppointmentsText(date: Date) {
    switch (differenceInCalendarDays(date, new Date())) {
      case 0:
        return "No appointments for today";
        break;
      case -1:
        return "No appointments for yesterday";
        break;
      case 1:
        return "No appointments for tomorrow";
        break;

      default:
        return "No appointments for this day";
        break;
    }
  }

  const noAppointmentsText = _noAppointmentsText(date);

  return (
    <div id="calendar">
      <div className="header">
        <h3>{format(date, "eeee, d MMMM yyyy")}</h3>
        <div className="navigation">
          <button onClick={() => setDate(subDays(date, 1))}>
            <NavArrowLeftIcon />
          </button>
          <button className="today" onClick={() => setDate(new Date())}>
            <NavArrowDownIcon color="var(--white)" />
          </button>
          <button onClick={() => setDate(addDays(date, 1))}>
            <NavArrowRightIcon />
          </button>
        </div>
      </div>
      <h2>Appointments</h2>
      <div className="content">
        {appointments.length ? (
          <div className="appointments"></div>
        ) : (
          <>
            <p className="no-appointments">{noAppointmentsText}</p>
            <Link to="/appointments/new" className="no-appointments">
              Create an Appointment
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Calendar;
