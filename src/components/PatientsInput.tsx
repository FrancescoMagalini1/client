import { memo, ChangeEvent, useRef, useCallback, useState } from "react";
import db from "../db";
import CustomInput from "./CustomInput";
import "../assets/styles/components/patients-input.css";
import XIcon from "./icons/XIcon";

type inputProps = {
  id?: string;
  initialValue?: string;
  maxLength?: number;
  changeFunction?: (patientIds: number[]) => void;
};

type patientSearch = {
  id: number;
  name: string;
  surname: string;
};

function PatientsInputComponent({ id = "", changeFunction }: inputProps) {
  let timerId = useRef<number | null>(null);
  let [patientSearchList, setPatientSearchList] = useState<patientSearch[]>([]);
  let [selectedPatients, setSelectedPatients] = useState<patientSearch[]>([]);

  const selectedPatientsSet = new Set(selectedPatients.map((el) => el.id));

  async function search(q: string) {
    if (!q) {
      setPatientSearchList([]);
      return;
    }
    //q = "%" + q + "%";
    q = q
      .split(/\s/)
      .map((s) => '"' + s + '"')
      .join(" OR ");
    let result = await db.select<patientSearch[]>(
      `SELECT ROWID AS id, name, surname FROM patients_fts 
        WHERE patients_fts = $1
        ORDER BY rank LIMIT $2`,
      [q, 10]
    );

    setPatientSearchList(result);
  }

  function addPatient(patient: patientSearch) {
    if (!selectedPatientsSet.has(patient.id)) {
      setSelectedPatients([...selectedPatients, patient]);
      if (changeFunction)
        changeFunction([...selectedPatients, patient].map((el) => el.id));
    }
  }

  function removePatient(patient: patientSearch) {
    setSelectedPatients(selectedPatients.filter((el) => el.id != patient.id));
    if (changeFunction)
      changeFunction(
        selectedPatients.filter((el) => el.id != patient.id).map((el) => el.id)
      );
  }

  let change = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const str = e.target.value;
    if (timerId.current != null) window.clearTimeout(timerId.current);
    timerId.current = window.setTimeout(search, 250, str);
  }, []);

  return (
    <div className="patients-input">
      <CustomInput
        id={id}
        type="search"
        maxLength={200}
        changeFunction={change}
      />
      <div className="selected-patients">
        {selectedPatients.map((patient) => (
          <div className="item" key={patient.id}>
            <p>
              {patient.name} {patient.surname}
            </p>
            <button onClick={() => removePatient(patient)}>
              <XIcon />
            </button>
          </div>
        ))}
      </div>
      <div className="patients-search-result">
        {patientSearchList.map((patient) =>
          selectedPatientsSet.has(patient.id) ? (
            <></>
          ) : (
            <div
              className="item"
              key={patient.id}
              onClick={() => addPatient(patient)}
            >
              <p>
                {patient.name} {patient.surname}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

const PatientsInput = memo(PatientsInputComponent);

export default PatientsInput;
