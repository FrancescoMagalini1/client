import "../assets/styles/new-appointment.css";
import { Link, useNavigate, useLoaderData } from "react-router-dom";
import ArrowLeftIcon from "../components/icons/ArrowLeftIcon";
import { FormEvent, useState, useCallback, ChangeEvent, useRef } from "react";
import CustomDatePickerSimple from "../components/CustomDatePicker";
import CustomTimePickerSimple from "../components/CustomTimePickerSimple";
import CustomNumberInput from "../components/CustomNumberInput";
import CustomTextArea from "../components/CustomTextArea";
import PatientsInput from "../components/PatientsInput";
import { unpackDate, formatDateTime } from "../utils";
import useAppStore from "../stores/appStore";
import db from "../db";
import { appointment } from "../typescript/types/data";
import { getHours, getMinutes, differenceInMinutes } from "date-fns";
import ConfirmationModal from "../components/ConfirmationModal";

const initialTime = [8, 0];
const initialDuration = 60;

function NewAppointment() {
  const appointment = useLoaderData() as appointment | undefined;
  const calendarDate = useAppStore((state) => state.calendarDate);
  const [startDate, setStartDate] = useState<Date | null>(
    appointment ? new Date(appointment.startDateTime) : calendarDate
  );
  const [startTime, setStartTime] = useState<number[] | null>(
    appointment
      ? [
          getHours(appointment.startDateTime),
          getMinutes(appointment.startDateTime),
        ]
      : initialTime
  );
  const [duration, setDuration] = useState<number | null>(
    appointment
      ? differenceInMinutes(appointment.endDateTime, appointment.startDateTime)
      : initialDuration
  ); // duration in minutes
  const [patients, setPatients] = useState<number[]>(
    appointment ? appointment.patients.map((el) => el.id) : []
  );
  const [description, setDescription] = useState(
    appointment ? appointment.description : ""
  );
  const [showModal, setShowModal] = useState(false);
  const dataSubmitting = useRef(false);
  let navigate = useNavigate();

  async function createOrUpdateAppointment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (dataSubmitting.current) return;
    if (!startDate || !startTime || !duration || !patients.length) return;
    dataSubmitting.current = true;
    try {
      let startDateTime = new Date(startDate);
      startDateTime.setHours(startTime[0], startTime[1], 0);
      let endDateTime = new Date(startDateTime.getTime() + duration * 60000);
      if (appointment) {
        await db.execute(
          "UPDATE appointments SET start_datetime=$1, end_datetime=$2, patients=$3, description=$4 WHERE ROWID=$5",
          [
            formatDateTime(startDateTime),
            formatDateTime(endDateTime),
            JSON.stringify(patients),
            description,
            appointment.id,
          ]
        );
      } else {
        await db.execute(
          "INSERT INTO appointments (start_datetime, end_datetime, patients, description) VALUES($1, $2, $3, $4)",
          [
            formatDateTime(startDateTime),
            formatDateTime(endDateTime),
            JSON.stringify(patients),
            description,
          ]
        );
      }
      navigate("/calendar");
    } catch (error) {
      console.error(error);
      dataSubmitting.current = false;
      navigate("/error");
    }
    dataSubmitting.current = false;
  }

  async function deleteAppointment() {
    if (dataSubmitting.current) return;
    dataSubmitting.current = true;
    try {
      if (appointment) {
        await db.execute("DELETE FROM appointments WHERE ROWID=$1", [
          appointment.id,
        ]);
        navigate("/calendar");
      }
    } catch (error) {
      console.error(error);
      navigate("/error");
    }
    dataSubmitting.current = false;
  }

  let changeStartDate = useCallback(
    (date: Date | null) => setStartDate(date),
    []
  );

  let changeStartTime = useCallback(
    (time: number[] | null) => setStartTime(time),
    []
  );

  let changeDuration = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      setDuration(e.target.value ? Number(e.target.value) : null),
    []
  );

  let changePatients = useCallback(
    (patientIds: number[]) => setPatients(patientIds),
    []
  );

  let changeDescription = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value),
    []
  );

  return (
    <>
      <ConfirmationModal
        show={showModal}
        message="Are you really sure you want to delete this appointment?"
        noCallback={() => setShowModal(false)}
        yesCallback={() => {
          setShowModal(false);
          deleteAppointment();
        }}
      />
      <div id="new-appointment">
        <div className="header">
          <Link to="/calendar">
            <ArrowLeftIcon />
          </Link>
        </div>
        <form action="" onSubmit={createOrUpdateAppointment} autoComplete="off">
          <label>Date</label>
          <CustomDatePickerSimple
            initialDate={unpackDate(
              appointment ? new Date(appointment.startDateTime) : calendarDate
            )}
            changeFunction={changeStartDate}
          />
          <label>Time</label>
          <CustomTimePickerSimple
            initialTime={
              appointment
                ? [
                    getHours(appointment.startDateTime),
                    getMinutes(appointment.startDateTime),
                  ]
                : initialTime
            }
            changeFunction={changeStartTime}
          />
          <label htmlFor="duration">Duration (in minutes)</label>
          <CustomNumberInput
            id="duration"
            name="duration"
            min={1}
            max={1440}
            initialValue={
              appointment
                ? differenceInMinutes(
                    appointment.endDateTime,
                    appointment.startDateTime
                  )
                : initialDuration
            }
            changeFunction={changeDuration}
          />
          <label htmlFor="patients-input">Patients</label>
          <PatientsInput
            id="patients-input"
            initialValue={
              appointment
                ? appointment.patients.map((el) => ({
                    id: el.id,
                    name: el.name,
                    surname: el.surname,
                  }))
                : []
            }
            changeFunction={changePatients}
          />
          <label htmlFor="description">Description</label>
          <CustomTextArea
            id="description"
            name="description"
            maxLength={2000}
            changeFunction={changeDescription}
            initialValue={appointment ? appointment.description : ""}
          />
          {appointment ? (
            <div className="buttons">
              <button
                type="button"
                className="delete"
                onClick={() => setShowModal(true)}
              >
                Delete appointment
              </button>
              <button>Update appointment</button>
            </div>
          ) : (
            <button>Create appointment</button>
          )}
        </form>
      </div>
    </>
  );
}

export default NewAppointment;
