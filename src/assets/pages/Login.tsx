import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../../config";
import { Body, fetch } from "@tauri-apps/api/http";
import { useAppDispatch } from "../../hooks";
import { logIn } from "../slices/userSlice";
import db from "../../db";

const EMPTY_ERROR_MESSAGE = "This field is required";
const CREDENTIAL_ERROR_MESSAGE = "Wrong username or password";
const SERVER_ERROR_MESSAGE = "An unexpected error occurred";

type Error = typeof CREDENTIAL_ERROR_MESSAGE | typeof SERVER_ERROR_MESSAGE;

type AuthData = {
  token: string;
  name: string;
  surname: string;
  id: number;
};

function Login() {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [generalError, setGeneralError] = useState<Error>(SERVER_ERROR_MESSAGE);
  const [showGeneralError, setShowGeneralError] = useState(false);
  const dispatch = useAppDispatch();
  let dataSubmitting = false;

  async function login(e: FormEvent) {
    e.preventDefault();
    if (dataSubmitting) return;
    setShowGeneralError(false);
    let returnFlag = false;
    if (!email) {
      setEmailError(true);
      returnFlag = true;
    }
    if (!password) {
      setPasswordError(true);
      returnFlag = true;
    }
    if (returnFlag) return;
    dataSubmitting = true;
    const response = await fetch<AuthData>(`${SERVER_URL}/v1/auth`, {
      method: "POST",
      body: Body.json({ email, password }),
    });

    if (response.ok) {
      let user = response.data;
      await db.execute(
        "INSERT INTO users(id, name, surname, token) VALUES ($1, $2, $3, $4)",
        [user.id, user.name, user.surname, user.token]
      );
      dispatch(logIn(user));
      navigate("/");
    } else {
      if (response.status == 400) {
        setGeneralError(CREDENTIAL_ERROR_MESSAGE);
        setShowGeneralError(true);
      } else {
        setGeneralError(SERVER_ERROR_MESSAGE);
        setShowGeneralError(true);
      }
    }
    dataSubmitting = false;
  }

  function changeEmail(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
    setEmailError(false);
  }

  function changePassword(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
    setPasswordError(false);
  }

  return (
    <div id="login">
      <h1>Login</h1>
      <form onSubmit={login}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="text"
          autoComplete="off"
          value={email}
          onChange={changeEmail}
        />
        <p
          className="error"
          style={{ visibility: emailError ? "visible" : "hidden" }}
        >
          {EMPTY_ERROR_MESSAGE}
        </p>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={changePassword}
        />
        <p
          className="error"
          style={{ visibility: passwordError ? "visible" : "hidden" }}
        >
          {EMPTY_ERROR_MESSAGE}
        </p>
        <button>Send</button>
      </form>
      <p
        className="error"
        style={{
          marginTop: "var(--space-m)",
          visibility: showGeneralError ? "visible" : "hidden",
        }}
      >
        {generalError}
      </p>
    </div>
  );
}

export default Login;
