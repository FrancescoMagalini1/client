import "../assets/styles/new-appointment.css";
import { Link, useNavigate } from "react-router-dom";
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

const initialTime = [8, 0];
const initialDuration = 60;

function NewAppointment() {
  const calendarDate = useAppStore((state) => state.calendarDate);
  const [startDate, setStartDate] = useState<Date | null>(calendarDate);
  const [startTime, setStartTime] = useState<number[] | null>(initialTime);
  const [duration, setDuration] = useState<number | null>(initialDuration); // duration in minutes
  const [patients, setPatients] = useState<number[]>([]);
  const [description, setDescription] = useState("");
  const dataSubmitting = useRef(false);
  let navigate = useNavigate();

  async function createAppointment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (dataSubmitting.current) return;
    if (!startDate || !startTime || !duration || !patients.length) return;
    dataSubmitting.current = true;
    try {
      let startDateTime = new Date(startDate);
      startDateTime.setHours(startTime[0], startTime[1], 0);
      let endDateTime = new Date(startDateTime.getTime() + duration * 60000);
      console.log(startDateTime, formatDateTime(startDateTime));
      console.log(endDateTime, formatDateTime(endDateTime));
      await db.execute(
        "INSERT INTO appointments (start_datetime, end_datetime, patients, description) VALUES($1, $2, $3, $4)",
        [
          formatDateTime(startDateTime),
          formatDateTime(endDateTime),
          JSON.stringify(patients),
          description,
        ]
      );
      navigate("/calendar");
    } catch (error) {
      console.error(error);
      dataSubmitting.current = false;
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
    <div id="new-appointment">
      <div className="header">
        <Link to="/calendar">
          <ArrowLeftIcon />
        </Link>
      </div>
      <form action="" onSubmit={createAppointment} autoComplete="off">
        <label>Date</label>
        <CustomDatePickerSimple
          initialDate={unpackDate(calendarDate)}
          changeFunction={changeStartDate}
        />
        <label>Time</label>
        <CustomTimePickerSimple
          initialTime={initialTime}
          changeFunction={changeStartTime}
        />
        <label htmlFor="duration">Duration (in minutes)</label>
        <CustomNumberInput
          id="duration"
          name="duration"
          min={1}
          max={1440}
          initialValue={initialDuration}
          changeFunction={changeDuration}
        />
        <label htmlFor="patients-input">Patients</label>
        <PatientsInput id="patients-input" changeFunction={changePatients} />
        <label htmlFor="description">Description</label>
        <CustomTextArea
          id="description"
          name="description"
          maxLength={2000}
          changeFunction={changeDescription}
        />
        <button>Create appointment</button>
      </form>
    </div>
  );
}

export default NewAppointment;
