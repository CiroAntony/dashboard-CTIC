import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import Header from "../../common/Header/Header";
import "./Services.css";

const Services = () => {
  const [services, setServices] = useState([]);
  const location = useLocation();
  const companyId = location?.state?.empresaId;

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
    axios
      .get("http://localhost:5000/api/services")
      .then((response) => {
        setServices(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los servicios:", error);
      });
  };

  console.log("ID de la empresa:", companyId ?? "undefined");

  return (
    <>
      <Header />
      <div className="main-service-container">
        <h1 className="tittle-service">Services</h1>
        <div className="cards">
          {services.map((service) => (
            <Link
              to={`/app/servicios/${service.id_servicio}/crear-informe/${companyId}`}
              key={service.id_servicio}
            >
              <div className="card">
              { service.nombre === "SERVERS" ? <i class="fa-solid fa-server service-icon"></i> : <></>}
              { service.nombre === "WORKSTATION" ? <i class="fa-regular fa-hard-drive service-icon"></i> : <></>}
              { service.nombre === "NETWORK" ? <i class="fa-solid fa-network-wired service-icon"></i> : <></>}
              { service.nombre === "EMAIL" ? <i class="fa-solid fa-envelope service-icon"></i> : <></>}
              { service.nombre === "WEBSITE" ? <i class="fa-solid fa-globe service-icon"></i> : <></>}
              { service.nombre === "PHONES" ? <i class="fa-solid fa-mobile service-icon"></i> : <></>}
              { service.nombre === "INTERNAL" ? <i class="fa-solid fa-ribbon service-icon"></i> : <></>}
                <h2>{service.nombre}</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Services;
