import Avatar from "boring-avatars";
import Navbar from "../../components/Navbar";
import LogoutIcon from "../../components/icons/LogoutIcon";
import { Outlet, useMatches } from "react-router-dom";
import { useEffect, useState } from "react";

const name = "Francesco Magalini";

const colors = ["#141414", "#bc9ddf", "#f9f5dc", "#bce3c5", "#82b3ae"];

function App() {
  let [title, setTitle] = useState("Home");
  let matches = useMatches();
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

  return (
    <div id="app">
      <div id="top">
        <div>
          <Avatar name={name} colors={colors} />
          <p style={{ marginLeft: "var(--space-2xs)" }}>{name}</p>
        </div>
        <h1>{title}</h1>
        <div>
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
