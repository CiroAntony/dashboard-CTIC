import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Typist from "react-typist";
import axios from "axios";
import "./LoginForm.css";
import SessionCheck from "../Functions/PreventCheck";

const LoginForm = () => {
  const [usuario, setUsuario] = useState("Admin");
  const [password, setPassword] = useState("Admin");
  const [errorMessage, setErrorMessage] = useState("");
  const [isUsuarioFocused, setIsUsuarioFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://ctic-server.onrender.com/api/login",
        {
          usuario,
          password,
        }
      );
      if (response.status === 200) {
        const { usuario, nombres, apellidos, correo, telefono, id_rol } =
          response.data;
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("username", usuario);
        localStorage.setItem("names", nombres);
        localStorage.setItem("lastName", apellidos);
        localStorage.setItem("email", correo);
        localStorage.setItem("phone", telefono);
        localStorage.setItem("rol", id_rol);
        navigate("/App");
      }
    } catch (error) {
      setErrorMessage("Invalid credentials or the account is inactive");
      console.log(error);
    }
  };

  const handleUsuarioFocus = () => {
    setIsUsuarioFocused(true);
  };

  const handleUsuarioBlur = () => {
    setIsUsuarioFocused(false);
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
  };

  return (
    <div className="complete__container">
      <SessionCheck />
      <div className="section__contain">
        <div className="grey"></div>

        <div className="login-container">
          <Typist className="type-anim">
            <p className="wel-p">
              Welcome to
              <span className="wel-sp">TIC</span>
            </p>

            <p className="frase">The most reliable IT solution</p>
          </Typist>
          <div className="login-box">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <div
                className={`user-box ${isUsuarioFocused || usuario !== "" ? "filled" : ""
                  }`}
              >
                <input
                  type="text"
                  value={usuario}
                  onChange={(event) => setUsuario(event.target.value)}
                  onFocus={handleUsuarioFocus}
                  onBlur={handleUsuarioBlur}
                />
                <label>Username</label>
              </div>
              <div
                className={`user-box ${isPasswordFocused || password !== "" ? "filled" : ""
                  }`}
              >
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onFocus={handlePasswordFocus}
                  onBlur={handlePasswordBlur}
                />
                <label>Password</label>
              </div>
              <button className="form__button" type="submit">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Login
              </button>
              {errorMessage && <p className="error">{errorMessage}</p>}
            </form>
          </div>
        </div>
      </div>
      )
    </div>
  );
};

export default LoginForm;
