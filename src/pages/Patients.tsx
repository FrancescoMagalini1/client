import "../assets/styles/patients.css";
import SearchIcon from "../components/icons/SearchIcon";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import CustomInput from "../components/CustomInput";
import { patient } from "../typescript/types/data";
import Avatar from "boring-avatars";
import { convertFileSrc } from "@tauri-apps/api/tauri";

const colors = ["#141414", "#bc9ddf", "#f9f5dc", "#bce3c5", "#82b3ae"];

function Patients() {
  const {
    patients,
    pages,
    current: currentPage,
    query: searchQuery,
  } = useLoaderData() as {
    patients: patient[];
    pages: number;
    current: number;
    query: string;
  };
  let navigate = useNavigate();

  function changePage(page: number) {
    if (page != currentPage)
      navigate(`/patients?q=${searchQuery}&page=${page}`);
  }

  return (
    <div id="patients">
      <div className="header">
        <div className="search">
          <form id="search-form" role="search">
            <CustomInput
              type="search"
              id="q"
              name="q"
              initialValue={searchQuery}
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
