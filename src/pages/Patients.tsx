import "../assets/styles/patients.css";
import SearchIcon from "../components/icons/SearchIcon";
import { Link, useLoaderData } from "react-router-dom";
import CustomInput from "../components/CustomInput";
import { patient } from "../typescript/types/data";
import Avatar from "boring-avatars";

const colors = ["#141414", "#bc9ddf", "#f9f5dc", "#bce3c5", "#82b3ae"];

function Patients() {
  const patients = useLoaderData() as patient[];
  return (
    <div id="patients">
      <div className="header">
        <div className="search">
          <CustomInput
            type="search"
            id="search-patients"
            name="search-patients"
          />
          <label htmlFor="search-patients">
            <SearchIcon />
          </label>
        </div>
        <Link to="/new-patient">Add a new Patient</Link>
      </div>
      <div className="content">
        {patients.map((patient) => (
          <div className="patient-card" key={patient.id}>
            <div className="avatar">
              <Avatar
                name={patient.name + " " + patient.surname}
                colors={colors}
                variant="beam"
                size="100%"
              />
            </div>
            <p className="name">{patient.name + " " + patient.surname}</p>
            <p className="description">{patient.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Patients;
