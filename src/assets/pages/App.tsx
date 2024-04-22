import Avatar from "boring-avatars";
import Navbar from "../../components/Navbar";
import LogoutIcon from "../../components/icons/LogoutIcon";
import { Outlet, useMatches, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useUserStore from "../stores/userStore";
import db from "../../db";

const colors = ["#141414", "#bc9ddf", "#f9f5dc", "#bce3c5", "#82b3ae"];

function App() {
  let [title, setTitle] = useState("Home");
  let matches = useMatches();
  let navigate = useNavigate();
  let name = useUserStore((state) => state.name);
  let surname = useUserStore((state) => state.surname);
  let userLogout = useUserStore((state) => state.logout);

  const titles = {
    "/": "Home",
    "/patients": "Patients",
    "/folders": "Folders",
    "/calendar": "Calendar",
    "/settings": "Settings",
  };

  useEffect(() => {
    let path = matches[1]?.pathname;
    if (path) {
      setTitle(titles[path as keyof typeof titles] ?? "Home");
    }
  }, [matches]);

  async function logout() {
    try {
      await db.execute("DELETE FROM users");
      userLogout();
      navigate("/login");
    } catch (error) {
      navigate("/error");
    }
  }

  return (
    <div id="app">
      <div id="top">
        <div>
          <Avatar name={name + " " + surname} colors={colors} />
          <p style={{ marginLeft: "var(--space-2xs)" }}>
            {name} {surname}
          </p>
        </div>
        <h1>{title}</h1>
        <div onClick={logout} style={{ cursor: "pointer" }}>
          <p style={{ marginRight: "var(--space-2xs)" }}>Logout</p>
          <LogoutIcon />
        </div>
      </div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
