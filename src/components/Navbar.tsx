import HomeIcon from "./icons/HomeIcon";
import PatientsIcon from "./icons/PatientsIcon";
import FoldersIcon from "./icons/FoldersIcon";
import CalendarIcon from "./icons/CalendarIcon";
import SettingsIcon from "./icons/SettingsIcon";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <NavLink to="/" style={{ padding: "var(--space-2xs)" }}>
        {({ isActive }) => (
          <HomeIcon
            width="32px"
            height="32px"
            color={isActive ? "var(--violet)" : "var(--black)"}
          />
        )}
      </NavLink>
      <NavLink to="/patients" style={{ padding: "var(--space-2xs)" }}>
        {({ isActive }) => (
          <PatientsIcon
            width="32px"
            height="32px"
            color={isActive ? "var(--violet)" : "var(--black)"}
          />
        )}
      </NavLink>
      <NavLink to="/folders" style={{ padding: "var(--space-2xs)" }}>
        {({ isActive }) => (
          <FoldersIcon
            width="32px"
            height="32px"
            color={isActive ? "var(--violet)" : "var(--black)"}
          />
        )}
      </NavLink>
      <NavLink to="/calendar" style={{ padding: "var(--space-2xs)" }}>
        {({ isActive }) => (
          <CalendarIcon
            width="32px"
            height="32px"
            color={isActive ? "var(--violet)" : "var(--black)"}
          />
        )}
      </NavLink>
      <NavLink
        to="/settings"
        style={{ marginTop: "auto", padding: "var(--space-2xs)" }}
      >
        {({ isActive }) => (
          <SettingsIcon
            width="32px"
            height="32px"
            color={isActive ? "var(--violet)" : "var(--black)"}
          />
        )}
      </NavLink>
    </nav>
  );
}

export default Navbar;
