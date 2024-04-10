import Avatar from "boring-avatars";
import Navbar from "../../components/Navbar";
import LogoutIcon from "../../components/icons/LogoutIcon";
import { Outlet, useMatches, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { logOut } from "../slices/userSlice";

const colors = ["#141414", "#bc9ddf", "#f9f5dc", "#bce3c5", "#82b3ae"];

function App() {
  let [title, setTitle] = useState("Home");
  let matches = useMatches();
  let navigate = useNavigate();
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const titles = {
    "/": "Home",
    "/patients": "Patients",
    "/folders": "Folders",
    "/calendar": "Calendar",
    "/settings": "Settings",
  };

  useEffect(() => {
    console.log(user);
    let path = matches[1]?.pathname;
    if (path) {
      setTitle(titles[path as keyof typeof titles] ?? "Home");
    }
  }, [matches]);

  function logout() {
    dispatch(logOut());
    navigate("/login");
  }

  return (
    <div id="app">
      <div id="top">
        <div>
          <Avatar name={user.name + " " + user.surname} colors={colors} />
          <p style={{ marginLeft: "var(--space-2xs)" }}>
            {user.name} {user.surname}
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
