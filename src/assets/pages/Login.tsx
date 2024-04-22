import { useState, FormEvent, ChangeEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../../config";
import { Body, fetch } from "@tauri-apps/api/http";
import useUserStore from "../stores/userStore";
import db from "../../db";
import { user } from "../../typescript/types/data";

const EMPTY_ERROR_MESSAGE = "This field is required";
const CREDENTIAL_ERROR_MESSAGE = "Wrong username or password";
const SERVER_ERROR_MESSAGE = "An unexpected error occurred";

type Error = typeof CREDENTIAL_ERROR_MESSAGE | typeof SERVER_ERROR_MESSAGE;

function Login() {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [generalError, setGeneralError] = useState<Error>(SERVER_ERROR_MESSAGE);
  const [showGeneralError, setShowGeneralError] = useState(false);
  let userLogin = useUserStore((state) => state.login);
  let dataSubmitting = useRef(false);

  async function login(e: FormEvent) {
    e.preventDefault();
    if (dataSubmitting.current) return;
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
    try {
      dataSubmitting.current = true;
      const response = await fetch<user>(`${SERVER_URL}/v1/auth`, {
        method: "POST",
        body: Body.json({ email, password }),
      });

      if (response.ok) {
        let user = response.data;
        await db.execute(
          "INSERT INTO users(id, name, surname, token) VALUES ($1, $2, $3, $4)",
          [user.id, user.name, user.surname, user.token]
        );
        userLogin(user);
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
    } catch (error) {
      setGeneralError(SERVER_ERROR_MESSAGE);
      setShowGeneralError(true);
    }
    dataSubmitting.current = false;
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
