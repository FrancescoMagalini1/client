import "../assets/styles/calendar.css";
import { useState, useEffect } from "react";
import NavArrowLeftIcon from "../components/icons/NavArrowLeftIcon";
import NavArrowRightIcon from "../components/icons/NavArrowRightIcon";
import NavArrowDownIcon from "../components/icons/NavArrowDownIcon";
import {
  format,
  subDays,
  addDays,
  differenceInCalendarDays,
  endOfWeek,
  startOfWeek,
  interval,
  eachDayOfInterval,
  getISODay,
  isSameDay,
  formatDistance,
  isSameMonth,
  addWeeks,
  subWeeks,
  startOfMonth,
  endOfMonth,
  getDate,
  addMonths,
  subMonths,
} from "date-fns";
import type { EndOfWeekOptions } from "date-fns";
import { Link } from "react-router-dom";
import useAppStore from "../stores/appStore";
import db from "../db";
import { formatDateTime } from "../utils";
import { appointment, appointmentSQLite } from "../typescript/types/data";
import ArrowLeftIcon from "../components/icons/ArrowLeftIcon";
import ArrowRightIcon from "../components/icons/ArrowRightIcon";

const weekOptions: EndOfWeekOptions = { weekStartsOn: 1 };

type view = "day" | "week" | "month";

type SQLiteCountResult = { n: number; day: string }[];

function Calendar() {
  let [date, setDate] = useState(new Date());
  let [weekData, setWeekData] = useState<Date[]>([]);
  let [monthData, setMonthData] = useState<Date[]>([]);
  let [fullMonthData, setfullMonthData] = useState<Date[]>([]);
  let [appointments, setAppointments] = useState<appointment[]>([]);
  let [appointmentsCount, setAppointmentsCount] = useState<number[]>([0]);
  let [view, setView] = useState<view>("day");
  const setCalendarDate = useAppStore((state) => state.setCalendarDate);

  function _setWeekData(date: Date) {
    let start = startOfWeek(date, weekOptions);
    let end = endOfWeek(date, weekOptions);
    setWeekData(eachDayOfInterval(interval(start, end)));
  }

  function _setMonthData(date: Date) {
    let start = startOfMonth(date);
    let end = endOfMonth(date);
    setMonthData(eachDayOfInterval(interval(start, end)));
  }

  useEffect(() => {
    if (monthData.length) {
      let start = startOfWeek(monthData[0], weekOptions);
      let end = endOfWeek(monthData[monthData.length - 1], weekOptions);
      setfullMonthData(eachDayOfInterval(interval(start, end)));
    }
  }, [monthData]);

  function moveWeek(number: 1 | -1) {
    _setWeekData(
      number == 1 ? addWeeks(weekData[0], 1) : subWeeks(weekData[0], 1)
    );
  }

  function moveMonth(number: 1 | -1) {
    _setMonthData(
      number == 1 ? addMonths(monthData[0], 1) : subMonths(monthData[0], 1)
    );
  }

  useEffect(() => {
    _setWeekData(date);
    _setMonthData(date);
  }, [date]);

  useEffect(() => {
    async function getPatients() {
      setCalendarDate(date);
      if (view == "day") {
        let startInterval = new Date(date);
        startInterval.setHours(0, 0, 0);
        let endInterval = new Date(date);
        endInterval.setHours(23, 59, 59);
        let result = await db.select<appointmentSQLite[]>(
          `SELECT ROWID as "id", start_datetime AS "startDateTime", end_datetime AS "endDateTime", description, (
          SELECT json_group_array(json_object('id', patients.ROWID, 'name', patients.name, 'surname', patients.surname, 
          'dateOfBirth', patients.date_of_birth, 'gender', patients.gender, 'description', patients.description, 'photo', patients.photo)) 
          FROM json_each(appointments.patients) INNER JOIN patients ON patients.ROWID = json_each.value
          ) AS "patients" 
          FROM appointments WHERE start_datetime > $1 AND start_datetime < $2 ORDER BY start_datetime`,
          [formatDateTime(startInterval), formatDateTime(endInterval)]
        );
        setAppointments(
          result.map((x) => ({ ...x, patients: JSON.parse(x.patients) }))
        );
        setAppointmentsCount([result.length]);
      } else if (view == "week") {
        let startInterval = new Date(weekData[0]);
        startInterval.setHours(0, 0, 0);
        let endInterval = new Date(weekData[weekData.length - 1]);
        endInterval.setHours(23, 59, 59);
        let result = await db.select<SQLiteCountResult>(
          `SELECT COUNT(*) AS n, date(start_datetime) AS day FROM appointments
          WHERE start_datetime > $1 AND start_datetime < $2 GROUP BY date(start_datetime)`,
          [formatDateTime(startInterval), formatDateTime(endInterval)]
        );
        let count = new Array(7).fill(0);
        result.forEach((row) => (count[getISODay(row.day) - 1] = row.n));
        setAppointmentsCount(count);
      } else {
        let startInterval = new Date(monthData[0]);
        startInterval.setHours(0, 0, 0);
        let endInterval = new Date(monthData[monthData.length - 1]);
        endInterval.setHours(23, 59, 59);
        let result = await db.select<SQLiteCountResult>(
          `SELECT COUNT(*) AS n, date(start_datetime) AS day FROM appointments
          WHERE start_datetime > $1 AND start_datetime < $2 GROUP BY date(start_datetime)`,
          [formatDateTime(startInterval), formatDateTime(endInterval)]
        );
        let count = new Array(7).fill(0);
        result.forEach((row) => (count[getDate(row.day) - 1] = row.n));
        setAppointmentsCount(count);
      }
    }

    getPatients().catch((error) => console.error(error));
  }, [weekData, monthData, view]);

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
        <div className="view">
          <button
            className={view == "day" ? "selected" : ""}
            onClick={() => (view != "day" ? setView("day") : null)}
          >
            Day
          </button>
          <button
            className={view == "week" ? "selected" : ""}
            onClick={() => (view != "week" ? setView("week") : null)}
          >
            Week
          </button>
          <button
            className={view == "month" ? "selected" : ""}
            onClick={() => (view != "month" ? setView("month") : null)}
          >
            Month
          </button>
        </div>
        <div className="navigation">
          <button onClick={() => setDate(subDays(date, 1))}>
            <NavArrowLeftIcon />
          </button>
          <button className="selected" onClick={() => setDate(new Date())}>
            <NavArrowDownIcon color="var(--white)" />
          </button>
          <button onClick={() => setDate(addDays(date, 1))}>
            <NavArrowRightIcon />
          </button>
        </div>
      </div>
      <div className="header">
        <h3>{format(date, "eeee, d MMMM yyyy")}</h3>
        <Link to="/appointments/new">Create an Appointment</Link>
      </div>
      <h2>Appointments</h2>
      <div className="content">
        {view == "day" ? (
          appointments.length ? (
            <>
              <div className="appointments">
                {appointments.map((appointment) => (
                  <div className="appointment" key={appointment.id}>
                    <p>
                      Time:{" "}
                      {format(new Date(appointment.startDateTime), "HH : mm")}
                      {" - "}
                      {format(new Date(appointment.endDateTime), "HH : mm")}
                    </p>
                    <p>
                      Patient{appointment.patients.length > 1 ? "s" : ""}:{" "}
                      {appointment.patients
                        .map((patient) => patient.name + " " + patient.surname)
                        .join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="no-appointments">{noAppointmentsText}</p>
          )
        ) : view == "week" ? (
          <>
            <div className="week-header">
              <button onClick={() => moveWeek(-1)}>
                <ArrowLeftIcon />
              </button>
              <p>
                {isSameMonth(weekData[0], weekData[weekData.length - 1])
                  ? `${format(weekData[0], "dd")} - ${format(
                      weekData[weekData.length - 1],
                      "dd MMM"
                    )}`
                  : `${format(weekData[0], "dd MMM")} - ${format(
                      weekData[weekData.length - 1],
                      "dd MMM"
                    )}`}
              </p>
              <button onClick={() => moveWeek(1)}>
                <ArrowRightIcon />
              </button>
            </div>
            <div className="week-appointments">
              {weekData.map((day, i) => (
                <div
                  onClick={() => {
                    setDate(day);
                    if (isSameDay(day, date)) setView("day");
                  }}
                  key={day.getTime()}
                  className={
                    isSameDay(day, date)
                      ? "selected"
                      : appointmentsCount[i]
                      ? "full"
                      : ""
                  }
                >
                  <p>{format(day, "dd")}</p>
                  <p>{format(day, "E")}</p>
                  <p>{appointmentsCount[i] || "Free"}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="month-header">
              <button onClick={() => moveMonth(-1)}>
                <ArrowLeftIcon />
              </button>
              <p>{format(monthData[0], "MMMM")}</p>
              <button onClick={() => moveMonth(1)}>
                <ArrowRightIcon />
              </button>
            </div>
            <div className="month-appointments">
              {weekData.map((day) => (
                <p className="week-day">{format(day, "E")}</p>
              ))}
              {fullMonthData.map((day) => (
                <div
                  onClick={() => {
                    setDate(day);
                    if (isSameDay(day, date)) setView("day");
                  }}
                  key={day.getTime()}
                  className={
                    isSameMonth(day, monthData[0])
                      ? isSameDay(day, date)
                        ? "selected"
                        : appointmentsCount[getDate(day)]
                        ? "full"
                        : ""
                      : "different-month"
                  }
                >
                  <p>{format(day, "dd")}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Calendar;
