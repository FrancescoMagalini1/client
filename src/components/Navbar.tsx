import HomeIcon from "./icons/HomeIcon";
import PatientsIcon from "./icons/PatientsIcon";
import FoldersIcon from "./icons/FoldersIcon";
import CalendarIcon from "./icons/CalendarIcon";
import SettingsIcon from "./icons/SettingsIcon";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <NavLink
        to="/"
        style={({ isActive }) => {
          return {
            padding: "var(--space-3xs)",
            borderRadius: "50%",
            backgroundColor: isActive ? "var(--violet)" : "var(--white)",
          };
        }}
      >
        {({ isActive }) => (
          <HomeIcon
            width="32px"
            height="32px"
            color={isActive ? "var(--white)" : "var(--black)"}
          />
        )}
      </NavLink>
      <NavLink
        to="/patients"
        style={({ isActive }) => {
          return {
            padding: "var(--space-3xs)",
            borderRadius: "50%",
            backgroundColor: isActive ? "var(--violet)" : "var(--white)",
          };
        }}
      >
        {({ isActive }) => (
          <PatientsIcon
            width="32px"
            height="32px"
            color={isActive ? "var(--white)" : "var(--black)"}
          />
        )}
      </NavLink>
      <NavLink
        to="/folders"
        style={({ isActive }) => {
          return {
            padding: "var(--space-3xs)",
            borderRadius: "50%",
            backgroundColor: isActive ? "var(--violet)" : "var(--white)",
          };
        }}
      >
        {({ isActive }) => (
          <FoldersIcon
            width="32px"
            height="32px"
            color={isActive ? "var(--white)" : "var(--black)"}
          />
        )}
      </NavLink>
      <NavLink
        to="/calendar"
        style={({ isActive }) => {
          return {
            padding: "var(--space-3xs)",
            borderRadius: "50%",
            backgroundColor: isActive ? "var(--violet)" : "var(--white)",
          };
        }}
      >
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
        style={({ isActive }) => {
          return {
            padding: "var(--space-3xs)",
            marginTop: "auto",
            borderRadius: "50%",
            backgroundColor: isActive ? "var(--violet)" : "var(--white)",
          };
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
