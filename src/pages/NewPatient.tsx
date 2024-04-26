import "../assets/styles/new-patient.css";
import ArrowLeftIcon from "../components/icons/ArrowLeftIcon";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "boring-avatars";
import { FormEvent, useState, useCallback, ChangeEvent, useRef } from "react";
import CustomInput from "../components/CustomInput";
import CustomDatePickerSimple from "../components/CustomDatePicker";
import CustomTextArea from "../components/CustomTextArea";
import CustomSelect from "../components/CustomSelect";
import PhotoIcon from "../components/icons/PhotoIcon";
import XIcon from "../components/icons/XIcon";
import { open } from "@tauri-apps/api/dialog";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import db from "../db";
import { createDir, BaseDirectory, exists, copyFile } from "@tauri-apps/api/fs";
import { join, appDataDir, extname } from "@tauri-apps/api/path";

const colors = ["#141414", "#bc9ddf", "#f9f5dc", "#bce3c5", "#82b3ae"];

const initialName = "John";
const initialSurname = "Doe";
const initialGenders = ["Female", "Male", "Other"];

function formatDate(date: string) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

type gender = "F" | "M" | "O";

function NewPatient() {
  const [name, setName] = useState(initialName);
  const [surname, setSurname] = useState(initialSurname);
  const [photoFile, setPhotoFile] = useState("");
  const [date, setDate] = useState("");
  const [gender, setGender] = useState<gender>("F");
  const [description, setDescription] = useState("");
  let dataSubmitting = useRef(false);
  let navigate = useNavigate();

  async function createPatient(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (dataSubmitting.current) return;
    dataSubmitting.current = true;
    try {
      const checkDir = await exists("patients", { dir: BaseDirectory.AppData });
      if (!checkDir) {
        await createDir("patients", { dir: BaseDirectory.AppData });
      }
      let path;
      if (photoFile) {
        const appDataDirPath = await appDataDir();
        const ext = await extname(photoFile);
        path = await join(
          appDataDirPath,
          "patients",
          `${name} ${surname} - ${new Date().getTime()}.${ext}`
        );
        await copyFile(photoFile, path);
      } else {
        path = "";
      }
      await db.execute(
        "INSERT INTO patients (name, surname, date_of_birth, gender, description, photo) VALUES ($1, $2, $3, $4, $5, $6)",
        [name, surname, formatDate(date), gender, description, photoFile]
      );
      navigate("/patients");
    } catch (error) {
      console.error(error);
    }
    dataSubmitting.current = false;
  }

  let changeName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value),
    []
  );

  let changeSurname = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setSurname(e.target.value),
    []
  );

  let changeDate = useCallback((str: string) => setDate(str), []);

  let changeGender = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    switch (e.target.value) {
      case "0":
        setGender("F");
        break;
      case "1":
        setGender("M");
        break;
      case "2":
        setGender("O");
        break;
    }
  }, []);

  let changeDescription = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value),
    []
  );

  async function changeAvatar() {
    const selected = await open({
      multiple: false,
      filters: [
        {
          name: "Image",
          extensions: ["png", "jpeg"],
        },
      ],
    });
    if (selected && !Array.isArray(selected)) {
      setPhotoFile(selected);
    }
  }

  return (
    <div id="new-patient">
      <div className="header">
        <Link to="/patients">
          <ArrowLeftIcon />
        </Link>
      </div>

      <form action="" onSubmit={createPatient} autoComplete="off">
        <div className="avatar">
          {photoFile ? (
            <>
              <img src={convertFileSrc(photoFile)} />
              <button
                type="button"
                className="delete-photo"
                onClick={() => setPhotoFile("")}
              >
                <XIcon />
              </button>
            </>
          ) : (
            <Avatar
              name={name + " " + surname}
              colors={colors}
              variant="beam"
              size="100%"
            />
          )}
          <button type="button" className="file-picker" onClick={changeAvatar}>
            <PhotoIcon />
          </button>
        </div>
        <h1>
          {name} {surname}
        </h1>
        <label htmlFor="name">Name</label>
        <CustomInput
          type="search"
          id="name"
          name="name"
          maxLength={200}
          initialValue={initialName}
          changeFunction={changeName}
        />
        <label htmlFor="surname">Surname</label>
        <CustomInput
          type="search"
          id="surname"
          name="surname"
          maxLength={200}
          initialValue={initialSurname}
          changeFunction={changeSurname}
        />
        <label htmlFor="date-of-birth">Date of Birth</label>
        <CustomDatePickerSimple changeFunction={changeDate} />
        <label htmlFor="gender">Gender</label>
        <CustomSelect
          data={initialGenders}
          id="gender"
          name="gender"
          changeFunction={changeGender}
        />
        <label htmlFor="description">Description</label>
        <CustomTextArea
          id="description"
          name="description"
          maxLength={2000}
          changeFunction={changeDescription}
        />
        <button>Add new Patient</button>
      </form>
    </div>
  );
}

export default NewPatient;
