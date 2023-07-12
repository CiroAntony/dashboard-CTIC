import "./index.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import LoginForm from "./components/Login/LoginForm";
import ProfileEmployee from "./components/Employee/ProfileEmployee";
import ListEmployee from "./components/Employee/ListEmployee";
import Servicios from "./components/Services/Services.jsx";
import Informes from "./components/Informes/Informes.jsx";

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/app" element={<App />} />
      <Route path="/app/profile-employee" element={<ProfileEmployee />} />
      <Route path="/app/list-employees" element={<ListEmployee />} />
      <Route path="/app/servicios/:companyId" element={<Servicios />} />
      <Route
        path="/app/servicios/:serviceId/crear-informe/:companyId"
        element={<Informes />}
      />
    </Routes>
  </Router>,
  document.getElementById("root")
);

reportWebVitals();
