import "../assets/styles/patients.css";
import SearchIcon from "../components/icons/SearchIcon";
import { Link, useNavigate } from "react-router-dom";
import CustomInput from "../components/CustomInput";
import { patient } from "../typescript/types/data";
import Avatar from "boring-avatars";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { colors } from "../utils";
import { useState, useRef, useCallback, ChangeEvent, useEffect } from "react";
import useAppStore from "../stores/appStore";
import db from "../db";

type SQLiteCount = { n: number }[];

const usersPerPage = 12;

function Patients() {
  let [patients, setPatients] = useState<patient[]>([]);
  let [pages, setPages] = useState<number>(0);
  let [currentPage, setCurrentPage] = useState<number>(1);
  /*let [searchQuery, setSearchQuery] = useState<string>(
    useAppStore.getState().patientsSearch
  );*/
  let navigate = useNavigate();
  let setAppSeachQuery = useAppStore((state) => state.setPatientsSearch);
  let setAppCurrentPage = useAppStore((state) => state.setPatientsPage);
  let timerId = useRef<number | null>(null);

  async function changePage(page: number) {
    if (page != currentPage)
      search(useAppStore.getState().patientsSearch, page);
  }

  useEffect(() => {
    search(
      useAppStore.getState().patientsSearch,
      useAppStore.getState().patientsPage
    );
  }, []);

  async function search(q: string, current: number = 1) {
    let result;
    let query = new String(q);
    if (q.length == 0) {
      result = await db.select<SQLiteCount>(
        "SELECT COUNT(*) AS n FROM patients"
      );
    } else if (q.length >= 3) {
      query = query
        .split(/\s/)
        .map((s) => '"' + s + '"')
        .join(" OR ");
      result = await db.select<SQLiteCount>(
        "SELECT COUNT(*) AS n FROM patients_fts WHERE patients_fts = $1",
        [query]
      );
    } else {
      query = "%" + query + "%";
      result = await db.select<SQLiteCount>(
        "SELECT COUNT(*) AS n FROM patients_fts WHERE name LIKE $1 OR surname LIKE $1 OR description LIKE $1",
        [query]
      );
    }
    let p = Math.ceil(result[0].n / usersPerPage); // pages
    if (current < 1 || current > p) return;
    if (q.length == 0) {
      result = await db.select<patient[]>(
        `SELECT ROWID AS 'id', name, surname, date_of_birth AS 'dateOfBirth', gender, description, photo 
        FROM patients ORDER BY ROWID LIMIT $1 OFFSET $2`,
        [usersPerPage, usersPerPage * (current - 1)]
      );
    } else if (q.length >= 3) {
      result = await db.select<patient[]>(
        `SELECT patients.ROWID AS 'id', patients.name, patients.surname, patients.date_of_birth AS 'dateOfBirth', 
        patients.gender, patients.description, patients.photo
        FROM patients INNER JOIN patients_fts ON patients.ROWID = patients_fts.ROWID
        WHERE patients_fts = $1
        ORDER BY rank LIMIT $2 OFFSET $3`,
        [query, usersPerPage, usersPerPage * (current - 1)]
      );
    } else {
      result = await db.select<patient[]>(
        `SELECT patients.ROWID AS 'id', patients.name, patients.surname, patients.date_of_birth AS 'dateOfBirth', 
        patients.gender, patients.description, patients.photo
        FROM patients INNER JOIN patients_fts ON patients.ROWID = patients_fts.ROWID
        WHERE patients_fts.name LIKE $1 OR patients_fts.surname LIKE $1 OR patients_fts.description LIKE $1
        ORDER BY rank LIMIT $2 OFFSET $3`,
        [query, usersPerPage, usersPerPage * (current - 1)]
      );
    }
    setAppSeachQuery(q);
    setAppCurrentPage(current);
    setPatients(result);
    setCurrentPage(current);
    setPages(p);
  }

  let change = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const str = e.target.value;
    if (timerId.current != null) window.clearTimeout(timerId.current);
    timerId.current = window.setTimeout(search, 250, str);
  }, []);

  return (
    <div id="patients">
      <div className="header">
        <div className="search">
          <form id="search-form" role="search">
            <CustomInput
              type="search"
              id="q"
              name="q"
              initialValue={useAppStore.getState().patientsSearch}
              changeFunction={change}
            />
            <label htmlFor="q">
              <SearchIcon />
            </label>
          </form>
        </div>
        <Link to="/patients/new">Add a new Patient</Link>
      </div>
      <div className="content">
        {patients.map((patient) => (
          <div
            className="patient-card"
            key={patient.id}
            onClick={() => navigate(`/patients/${patient.id}`)}
          >
            <div className="avatar">
              {patient.photo ? (
                <img src={convertFileSrc(patient.photo)} />
              ) : (
                <Avatar
                  name={patient.name + " " + patient.surname}
                  colors={colors}
                  variant="beam"
                  size="100%"
                />
              )}
            </div>
            <p className="name">{patient.name + " " + patient.surname}</p>
            <p className="description">{patient.description}</p>
          </div>
        ))}
      </div>
      {pages > 1 ? (
        <div className="navigation">
          {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map(
            (i) => (
              <button
                key={i}
                className={currentPage == i ? "active" : ""}
                onClick={() => changePage(i)}
              >
                {i}
              </button>
            )
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Patients;
