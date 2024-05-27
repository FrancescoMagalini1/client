import "../assets/styles/new-patient.css";
import ArrowLeftIcon from "../components/icons/ArrowLeftIcon";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
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
import {
  createDir,
  BaseDirectory,
  exists,
  copyFile,
  removeFile,
} from "@tauri-apps/api/fs";
import { join, appDataDir, extname } from "@tauri-apps/api/path";
import { patient } from "../typescript/types/data";
import { unpackDate, formatDate } from "../utils";

const colors = ["#141414", "#bc9ddf", "#f9f5dc", "#bce3c5", "#82b3ae"];

const initialName = "John";
const initialSurname = "Doe";
const initialGenders = ["Female", "Male", "Other"];

type gender = "F" | "M" | "O";

function NewPatient() {
  const initialPatient = useLoaderData() as patient | undefined;
  const [name, setName] = useState(initialPatient?.name ?? initialName);
  const [surname, setSurname] = useState(
    initialPatient?.surname ?? initialSurname
  );
  const [photoFile, setPhotoFile] = useState(initialPatient?.photo ?? "");
  const [date, setDate] = useState<Date | null>(new Date());
  const [gender, setGender] = useState<gender>(initialPatient?.gender ?? "F");
  const [description, setDescription] = useState(
    initialPatient?.description ?? ""
  );
  let dataSubmitting = useRef(false);
  let navigate = useNavigate();

  async function createOrUpdatePatient(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (dataSubmitting.current) return;
    dataSubmitting.current = true;
    if (date == null || !name || !surname) return;
    try {
      const checkDir = await exists("patients", {
        dir: BaseDirectory.AppData,
      });
      if (!checkDir) {
        await createDir("patients", { dir: BaseDirectory.AppData });
      }
      let path;
      if (initialPatient) {
        if (initialPatient.photo != photoFile) {
          if (photoFile) {
            const appDataDirPath = await appDataDir();
            const ext = await extname(photoFile);
            path = await join(
              appDataDirPath,
              "patients",
              `${name} ${surname} - ${new Date().getTime()}.${ext}`
            );
            await copyFile(photoFile, path);
          }
          if (initialPatient.photo) {
            const checkFile = await exists(initialPatient.photo);
            if (checkFile) {
              await removeFile(initialPatient.photo);
            }
          }
        }
        await db.execute(
          "UPDATE patients SET name=$1, surname=$2, date_of_birth=$3, gender=$4, description=$5, photo=$6 WHERE ROWID=$7",
          [
            name,
            surname,
            formatDate(date),
            gender,
            description,
            initialPatient.photo != photoFile
              ? path ?? ""
              : initialPatient.photo,
            initialPatient.id,
          ]
        );
      } else {
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
          [name, surname, formatDate(date), gender, description, path]
        );
      }
      navigate("/patients");
    } catch (error) {
      console.error(error);
      navigate("/error");
    }
    dataSubmitting.current = false;
  }

  async function deletePatient() {
    if (dataSubmitting.current) return;
    dataSubmitting.current = true;
    try {
      if (initialPatient) {
        if (initialPatient.photo) {
          const checkFile = await exists(initialPatient.photo);
          if (checkFile) {
            await removeFile(initialPatient.photo);
          }
        }
        await db.execute("DELETE FROM patients WHERE ROWID=$1", [
          initialPatient.id,
        ]);
        navigate("/patients");
      }
    } catch (error) {
      console.error(error);
      navigate("/error");
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

  let changeDate = useCallback((date: Date | null) => setDate(date), []);

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
          extensions: ["png", "jpeg", "jpg"],
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

      <form action="" onSubmit={createOrUpdatePatient} autoComplete="off">
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
          initialValue={initialPatient?.name ?? initialName}
          changeFunction={changeName}
        />
        <label htmlFor="surname">Surname</label>
        <CustomInput
          type="search"
          id="surname"
          name="surname"
          maxLength={200}
          initialValue={initialPatient?.surname ?? initialSurname}
          changeFunction={changeSurname}
        />
        <label htmlFor="date-of-birth">Date of Birth</label>
        <CustomDatePickerSimple
          changeFunction={changeDate}
          initialDate={
            initialPatient?.dateOfBirth
              ? unpackDate(new Date(initialPatient?.dateOfBirth))
              : []
          }
        />
        <label htmlFor="gender">Gender</label>
        <CustomSelect
          data={initialGenders}
          initialValue={["F", "M", "O"].indexOf(initialPatient?.gender ?? "F")}
          id="gender"
          name="gender"
          changeFunction={changeGender}
        />
        <label htmlFor="description">Description</label>
        <CustomTextArea
          id="description"
          name="description"
          initialValue={initialPatient?.description ?? ""}
          maxLength={2000}
          changeFunction={changeDescription}
        />
        {initialPatient ? (
          <div className="buttons">
            <button className="delete" type="button" onClick={deletePatient}>
              Delete Patient
            </button>
            <button>Update Patient</button>
          </div>
        ) : (
          <button>Add new Patient</button>
        )}
      </form>
    </div>
  );
}

export default NewPatient;
