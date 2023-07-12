import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Companies.css";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

const CompaniesContainer = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newCompany, setNewCompany] = useState({
    nombre: "",
    ruc: "",
    direccion: "",
    telefono: "",
    imagen: null,
  });
  const [formError, setFormError] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCompanyData, setSelectedCompanyData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [companiesPerPage] = useState(12);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/companies");
      setCompanies(response.data);
    } catch (error) {
      console.error("Error al obtener las empresas:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCompanies = companies.filter((company) => {
    return company.nombre.includes(searchTerm);
  });

  const handleNewCompany = () => {
    setShowForm(true);
    setNewCompany({
      nombre: "",
      ruc: "",
      direccion: "",
      telefono: "",
      imagen: null,
    });
  };

  const validateImageSize = (file) => {
    const maxSize = 1 * 1024 * 1024;
    if (file && file.size > maxSize) {
      setFormError("The image size should not exceed 1 MB.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      newCompany.nombre === "" ||
      newCompany.ruc === "" ||
      newCompany.direccion === "" ||
      newCompany.telefono === ""
    ) {
      setFormError("All fields are required");
      return;
    }

    if (!validateImageSize(newCompany.imagen)) {
      return;
    }

    if (
      isEditing &&
      newCompany.imagen &&
      newCompany.imagen.size > 1 * 1024 * 1024
    ) {
      setFormError("The image size should not exceed 1 MB.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("nombre", newCompany.nombre);
      formData.append("ruc", newCompany.ruc);
      formData.append("direccion", newCompany.direccion);
      formData.append("telefono", newCompany.telefono);
      formData.append("imagen", newCompany.imagen);

      if (isEditing) {
        const editedCompany = { ...selectedCompanyData, ...newCompany };
        if (newCompany.imagen === null) {
          delete editedCompany.imagen;
        }

        await axios.put(
          `http://localhost:5000/api/companies/${selectedCompanyData.id_empresa}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await axios.post("http://localhost:5000/api/companies", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      fetchCompanies();
      resetForm();
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);

      setShowForm(false);
    } catch (error) {
      console.error("Error al guardar la empresa:", error);
    }
  };

  const handleFormChange = (event) => {
    if (event.target.name === "imagen") {
      const file = event.target.files[0];
      if (!validateImageSize(file)) {
        return;
      }

      setNewCompany({
        ...newCompany,
        imagen: file,
      });
    } else {
      setNewCompany({
        ...newCompany,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleEditCompany = (companyId) => {
    const companyToEdit = companies.find(
      (company) => company.id_empresa === companyId
    );

    if (companyToEdit) {
      if (companyToEdit.imagen && companyToEdit.imagen.size > 1 * 1024 * 1024) {
        setFormError("The image size should not exceed 1 MB.");
        return;
      }

      setIsEditing(true);
      setShowForm(true);
      setSelectedCompanyData(companyToEdit);
      setNewCompany({ ...companyToEdit });
    }
  };

  const handleCloseForm = () => {
    if (
      isEditing &&
      newCompany.imagen &&
      newCompany.imagen.size > 1 * 1024 * 1024
    ) {
      setFormError("The image size should not exceed 1 MB.");
      return;
    }

    setShowForm(false);
    setIsEditing(false);
    setSelectedCompanyData(null);
    resetForm();
  };

  const resetForm = () => {
    setFormError("");
    setNewCompany({
      nombre: "",
      ruc: "",
      direccion: "",
      telefono: "",
      imagen: null,
    });
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".card", {
      opacity: 0,
      y: 50,
      stagger: 0.2,
      duration: 2,
      scrollTrigger: {
        trigger: ".card",
        start: "top 80%",
      },
    });
  }, []);

  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = filteredCompanies.slice(
    indexOfFirstCompany,
    indexOfLastCompany
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="search__container">
        <input
          className="input-search"
          type="text"
          placeholder="Search company"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="button-new" onClick={handleNewCompany}>
          Add
        </button>
      </div>
      <div className="company-primary-container">
        <div className="companies__container">
          {currentCompanies.map((company) => (
            <div key={company.id_empresa} className="card">
              <small className="datos" key={company.direccion}>
                {company.direccion}
              </small>
              <div className="ctn2">
                <FaEdit
                  className="edit"
                  onClick={() => handleEditCompany(company.id_empresa)}
                />
              </div>
              <Link
                to={`/app/servicios/${company.id_empresa}`}
                className="servicios"
                state={{ empresaId: company.id_empresa }}
              >
                <div className="servicios__box">
                  <div className="content">
                    <h3 className="heading">{company.nombre}</h3>
                    <p className="datos" key={company.ruc}>
                      <b>RUC:</b> {company.ruc}
                    </p>
                    <p className="datos" key={company.telefono}>
                      <b>Phone:</b> {company.telefono}
                    </p>
                  </div>
                  {company.imagen ? (
                    <img
                      src={`http://localhost:5000/api/companies/${company.id_empresa}/imagen`}
                      alt="user_image"
                      className="companie__image"
                      width="60"
                    />
                  ) : (
                    <img
                      src={require("../../assets/image-not-available.webp")}
                      alt="Image not available"
                      className="companie__image"
                    />
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="floating-form-container">
          <div className="floating-form">
            <button className="close-button" onClick={handleCloseForm}>
              X
            </button>
            <h3>{isEditing ? "Edit company" : "New company"}</h3>
            {formError && <p className="error-message">{formError}</p>}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <input
                type="text"
                name="nombre"
                placeholder="Company name"
                value={newCompany.nombre}
                onChange={handleFormChange}
              />
              <input
                type="text"
                name="ruc"
                placeholder="RUC"
                value={newCompany.ruc}
                onChange={handleFormChange}
              />
              <input
                type="text"
                name="direccion"
                placeholder="Address"
                value={newCompany.direccion}
                onChange={handleFormChange}
              />
              <input
                type="text"
                name="telefono"
                placeholder="Phone"
                value={newCompany.telefono}
                onChange={handleFormChange}
              />
              <input type="file" name="imagen" onChange={handleFormChange} />
              <button type="submit">
                {isEditing ? "Save Changes" : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}
      {showSuccessMessage && (
        <div className="success-message">
          <p>
            {isEditing ? "Changes saved successfully" : "Saved successfully"}
          </p>
        </div>
      )}

      <div className="pagination">
        {filteredCompanies.length > companiesPerPage && (
          <ul>
            {Array.from(
              {
                length: Math.ceil(filteredCompanies.length / companiesPerPage),
              },
              (_, index) => (
                <li
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={currentPage === index + 1 ? "active" : ""}
                >
                  {index + 1}
                </li>
              )
            )}
          </ul>
        )}
      </div>
    </>
  );
};

export default CompaniesContainer;
