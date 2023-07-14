import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ListEmployee.css";
import Header from "../../common/Header/Header";
import { useNavigate } from "react-router-dom";
import PreventNav from "../Functions/Navigate";
import { FaEdit } from "react-icons/fa";

const ListEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    usuario: "",
    password: "",
    nombres: "",
    apellidos: "",
    correo: "",
    telefono: "",
    id_rol: "",
    id_empresa: "",
    estado: "1",
    imagen: null,
  });
  const [formError, setFormError] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [companySelectedId, setCompanySelectedId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("rol") === "1";
    if (!isAdmin) {
      navigate("/app");
    } else {
      fetchEmployees();
      fetchRoles();
      fetchCompanies();
    }
  }, [navigate]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/usuario");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error al obtener la lista de empleados:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/roles");
      setRoles(response.data);
    } catch (error) {
      console.error("Error al obtener la lista de roles:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/companies");
      setCompanies(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error al obtener la lista de empresas:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredEmployees = employees.filter((employee) => {
    const fullName = `${employee.nombres} ${employee.apellidos}`;
    return fullName.includes(searchTerm);
  });

  const handleNewEmployee = () => {
    setShowForm(true);
    resetForm();
  };

  const resetForm = () => {
    setNewEmployee({
      usuario: "",
      password: "",
      nombres: "",
      apellidos: "",
      correo: "",
      telefono: "",
      id_rol: "",
      id_empresa: "",
      estado: "1",
      imagen: null,
    });
    setFormError("");
    setEditEmployeeId(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setNewEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));

    if (name === "id_empresa") {
      setCompanySelectedId(parseInt(value));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("New Employee Data:", newEmployee);

    try {
      const { imagen, ...employeeWithoutImage } = newEmployee;
      if (
        Object.values(employeeWithoutImage).some(
          (value) => value === "" || value === null
        )
      ) {
        setFormError("All fields are required");
        return;
      }

      const formData = new FormData();
      formData.append("usuario", newEmployee.usuario);
      formData.append("password", newEmployee.password);
      formData.append("nombres", newEmployee.nombres);
      formData.append("apellidos", newEmployee.apellidos);
      formData.append("correo", newEmployee.correo);
      formData.append("telefono", newEmployee.telefono);
      formData.append("id_rol", newEmployee.id_rol);
      formData.append("id_empresa", parseInt(newEmployee.id_empresa));
      formData.append("estado", newEmployee.estado);

      if (newEmployee.imagen) {
        formData.append("imagen", newEmployee.imagen);
      }

      if (editEmployeeId) {
        await axios.put(
          `http://localhost:5000/api/usuario/${editEmployeeId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await axios.post("http://localhost:5000/api/usuario", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      fetchEmployees();
      resetForm();
      setShowForm(false);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);
    } catch (error) {
      console.error("Error al crear/editar el empleado:", error);
      setFormError("Error al crear/editar el empleado");
    }
  };

  const handleEditEmployee = (employeeId) => {
    const employeeToEdit = employees.find(
      (employee) => employee.id_usuario === employeeId
    );

    if (employeeToEdit) {
      setEditEmployeeId(employeeId);
      setShowForm(true);
      setNewEmployee({
        usuario: employeeToEdit.usuario,
        password: employeeToEdit.password,
        nombres: employeeToEdit.nombres,
        apellidos: employeeToEdit.apellidos,
        correo: employeeToEdit.correo,
        telefono: employeeToEdit.telefono,
        id_rol: employeeToEdit.id_rol,
        id_empresa: employeeToEdit.id_empresa,
        estado: employeeToEdit.estado.toString(),
        imagen: null,
      });
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    resetForm();
  };

  return (
    <>
      <PreventNav />
      <div className="list-employee-container">
        <Header />
      </div>

      <div className="search__container">
        <input
          className="input-search"
          type="text"
          placeholder="Search employee"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="button-new" onClick={handleNewEmployee}>
          Add
        </button>
      </div>
      <div className="employees__container">
        <div className="secondary-container">
          {filteredEmployees.map((employee) => (
            <div key={employee.id_usuario} className="col-md-4 side_bar">
              <div className="user_profile_card">
                <div className="user_profile_img">
                  <div className="companie-img-container">
                    { employee.imagen ? <img
                      src={`http://localhost:5000/api/usuario/${employee.id_usuario}/imagen`}
                      alt="companie_image"
                      className="companie-img"
                    /> : <img
                    src={require("../../assets/user-not-image.webp")}
                    alt="user not found"
                    className="companie__image"
                  />}
                    
                  </div>
                </div>
                <div className="user_details">
                  <div className="user_profile_name">
                    <h5 className="user-name">
                      {employee.nombres} {employee.apellidos}
                    </h5>
                  </div>
                  <div className="user_profile_userID">
                    <h5>
                      Username:<span> {employee.usuario}</span>
                    </h5>
                  </div>
                  <div className="user_profile_mail">
                    <h5>
                      Email:<span> {employee.correo}</span>
                    </h5>
                  </div>
                  <div className="user_designation">
                    <h5>{employee.id_rol === 1 ? "ADMIN" : "Empleado"}</h5>
                  </div>
                  <div className="edit-container">
                    <FaEdit
                      className="edit"
                      onClick={() => handleEditEmployee(employee.id_usuario)}
                    />
                  </div>
                </div>
                <div className="circle_decor1"></div>
                <div className="circle_decor2"></div>
                <div className="circle_decor3"></div>
              </div>
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
            <h3>{editEmployeeId ? "Edit employee:" : "New employee:"}</h3>
            {formError && <p className="error-message">{formError}</p>}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="usuario"
                placeholder="Username"
                value={newEmployee.usuario}
                onChange={handleFormChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={newEmployee.password}
                onChange={handleFormChange}
                required
              />
              <input
                type="text"
                name="nombres"
                placeholder="First Name"
                value={newEmployee.nombres}
                onChange={handleFormChange}
                required
              />
              <input
                type="text"
                name="apellidos"
                placeholder="Last Name"
                value={newEmployee.apellidos}
                onChange={handleFormChange}
                required
              />
              <input
                type="email"
                name="correo"
                placeholder="Email"
                value={newEmployee.correo}
                onChange={handleFormChange}
                required
              />
              <input
                type="text"
                name="telefono"
                placeholder="Phone Number"
                value={newEmployee.telefono}
                onChange={handleFormChange}
                required
              />
              <select
                name="id_rol"
                value={newEmployee.id_rol}
                onChange={handleFormChange}
                required
              >
                <option value="">Select Role</option>
                <option value="1">admin</option>
                <option value="2">empleado</option>
              </select>
              <select
                name="id_empresa"
                value={newEmployee.id_empresa}
                onChange={handleFormChange}
                required
              >
                <option value="">Select Company</option>
                {companies.map((company) => (
                  <option key={company.id_empresa} value={company.id_empresa}>
                    {company.nombre}
                  </option>
                ))}
              </select>

              <select
                name="estado"
                value={newEmployee.estado}
                onChange={handleFormChange}
                required
              >
                <option value="">Select Status</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>

              <input
                type="file"
                name="imagen"
                accept="image/*"
                onChange={(e) =>
                  setNewEmployee((prevEmployee) => ({
                    ...prevEmployee,
                    imagen: e.target.files[0],
                  }))
                }
              />

              <button type="submit" className="submit-button">
                {editEmployeeId ? "Save Changes" : "Create Employee"}
              </button>
            </form>
          </div>
        </div>
      )}
      {showSuccessMessage && (
        <div className="success-message">
          {editEmployeeId
            ? "Employee updated successfully"
            : "Employee created successfully"}
        </div>
      )}
    </>
  );
};

export default ListEmployee;
