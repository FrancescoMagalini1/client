import HomeIcon from "./icons/HomeIcon";
import PatientsIcon from "./icons/PatientsIcon";
import FoldersIcon from "./icons/FoldersIcon";
import CalendarIcon from "./icons/CalendarIcon";
import SettingsIcon from "./icons/SettingsIcon";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <NavLink to="/">
        {({ isActive }) => (
          <HomeIcon
            width="32px"
            height="32px"
            color={isActive ? "var(--white)" : "var(--black)"}
          />
        )}
      </NavLink>
      <NavLink to="/patients">
        {({ isActive }) => (
          <PatientsIcon
            width="32px"
            height="32px"
            color={isActive ? "var(--white)" : "var(--black)"}
          />
        )}
      </NavLink>
      <NavLink to="/folders">
        {({ isActive }) => (
          <FoldersIcon
            width="32px"
            height="32px"
            color={isActive ? "var(--white)" : "var(--black)"}
          />
        )}
      </NavLink>
      <NavLink to="/calendar">
        {({ isActive }) => (
          <CalendarIcon
            width="32px"
            height="32px"
            color={isActive ? "var(--white)" : "var(--black)"}
          />
        )}
      </NavLink>
      <NavLink
        to="/settings"
        style={{
          marginTop: "auto",
        }}
      >
        {({ isActive }) => (
          <SettingsIcon
            width="32px"
            height="32px"
            color={isActive ? "var(--white)" : "var(--black)"}
          />
        )}
      </NavLink>
    </nav>
  );
}

export default Navbar;
