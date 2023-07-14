import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import * as XLSX from "xlsx";
import "./Informes.css";
import Navbar from "../../common/Header/Header.jsx";

export default function Informes() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [preguntas, setPreguntas] = useState([]);
  const [informes, setInformes] = useState([]);
  const [selectedInforme, setSelectedInforme] = useState(null);
  const { serviceId, companyId } = useParams();
  const [preguntasConSi, setPreguntasConSi] = useState([]);
  const [preguntasConSiV2, setPreguntasConSiV2] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/preguntas/${serviceId}`)
      .then((response) => {
        setPreguntas(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las preguntas:", error);
      });

    axios
      .get(`http://localhost:5000/api/informes/${companyId}/${serviceId}`)
      .then((response) => {
        setInformes(response.data);
        console.log(response.data);

        const totalPreguntas = preguntas.length;

        const informesConSi = response.data.reduce((acc, informe) => {
          axios
            .get(`http://localhost:5000/api/respuestas/${informe.informeId}`)
            .then((response) => {
              const preguntasSi = response.data.filter(
                (respuesta) =>
                  respuesta.respuesta === 1 || respuesta.respuesta === "SI"
              ).length;
              const porcentaje = (preguntasSi / totalPreguntas) * 100;
              setPreguntasConSi((prevState) => ({
                ...prevState,
                [informe.informeId]: porcentaje,
                totalPreguntas: totalPreguntas.toString(),
              }));
            })
            .catch((error) => {
              console.error(
                "Error al obtener las respuestas del informe:",
                error
              );
            });

          return acc;
        }, {});
        setPreguntasConSi(informesConSi);

        const informesConSiV2 = response.data.reduce((acc, informe) => {
          axios
            .get(`http://localhost:5000/api/respuestas/${informe.informeId}`)
            .then((response) => {
              const preguntasSi = response.data.filter(
                (respuesta) =>
                  respuesta.respuesta === 1 || respuesta.respuesta === "SI"
              ).length;
              setPreguntasConSiV2((prevState) => ({
                ...prevState,
                [informe.informeId]: `${preguntasSi} / ${totalPreguntas}`,
                totalPreguntas: totalPreguntas.toString(),
              }));
            })
            .catch((error) => {
              console.error(
                "Error al obtener las respuestas del informe:",
                error
              );
            });

          return acc;
        }, {});
        setPreguntasConSiV2(informesConSiV2);
      })
      .catch((error) => {
        console.error("Error al obtener los informes:", error);
      });
  }, [serviceId, companyId, preguntas.length]);

  const handleCrearInforme = () => {
    setMostrarFormulario(true);
  };

  const handleSwitchChange = (event, index) => {
    const updatedPreguntas = [...preguntas];
    updatedPreguntas[index].respuesta = event.target.checked ? 1 : 0;
    setPreguntas(updatedPreguntas);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:5000/api/informes", {
        companyId,
        serviceId,
      })
      .then((response) => {
        const informeId = response.data.id_informe;

        const respuestas = preguntas.map((pregunta) => ({
          informe_id: informeId,
          pregunta_id: pregunta.id_pregunta,
          respuesta: pregunta.respuesta,
        }));

        axios
          .post("http://localhost:5000/api/respuestas", {
            informeId,
            respuestas,
          })
          .then((response) => {
            console.log("Respuestas guardadas exitosamente:", response.data);
            setMostrarFormulario(false);
            setPreguntas([]);
          })
          .catch((error) => {
            console.error("Error al guardar las respuestas:", error);
          });
      })
      .catch((error) => {
        console.error("Error al crear el informe:", error);
      });
  };

  const handleVerInforme = (informeId) => {
    axios
      .get(`http://localhost:5000/api/respuestas/${informeId}`)
      .then((response) => {
        const respuestas = response.data;
        const preguntaIds = respuestas.map(
          (respuesta) => respuesta.pregunta_id
        );
        const preguntasRelacionadas = preguntas.filter((pregunta) =>
          preguntaIds.includes(pregunta.id_pregunta)
        );
        const informe = {
          informeId,
          fechaCreacion: informes.find(
            (informe) => informe.informeId === informeId
          )?.fechaCreacion,
          respuestas: respuestas.map((respuesta) => {
            const pregunta = preguntasRelacionadas.find(
              (pregunta) => pregunta.id_pregunta === respuesta.pregunta_id
            );
            return {
              ...respuesta,
              pregunta: pregunta ? pregunta.pregunta : "Pregunta no encontrada",
            };
          }),
        };
        setSelectedInforme(informe);
      })
      .catch((error) => {
        console.error("Error al obtener las respuestas del informe:", error);
      });
  };

  const handleCerrarRespuestas = () => {
    setSelectedInforme(null);
  };

  const totalRespuestas = preguntas.length;
  const respuestasSi = preguntas.filter(
    (pregunta) => pregunta.respuesta === 1
  ).length;

  const barraProgress = (respuestasSi / totalRespuestas) * 100;

  const calcularPorcentajes = (respuestas) => {
    const totalRespuestas = respuestas.length;
    const respuestasSi = respuestas.filter(
      (respuesta) => respuesta.respuesta === 1 || respuesta.respuesta === "SI"
    ).length;
    const barraProgress = (respuestasSi / totalRespuestas) * 100;

    return barraProgress;
  };

  const exportarAExcel = () => {
    const { respuestas } = selectedInforme;

    const data = respuestas.map((respuesta) => ({
      Pregunta: respuesta.pregunta,
      Respuesta: respuesta.respuesta ? "SI" : "NO",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Respuestas");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fecha = new Date().toLocaleDateString("en-GB");
    const nombreArchivo = `Informe_respuestas_${selectedInforme.informeId}_${fecha}.xlsx`;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = nombreArchivo;
    link.click();
  };

  return (
    <div>
      <Navbar />

      {mostrarFormulario && (
        <div className="form-informes">
          <div className="titulo-ctnr">
            <span
              className="close-button"
              onClick={() => setMostrarFormulario(false)}
            >
              X
            </span>
          </div>
          <div className="container">
            <h2 className="titulo-informe">Formulario </h2>
            <div className="grafico-linea">
              <div className="barra" style={{ height: "20px" }}></div>
              {
                <div
                  className="bar__progress"
                  style={{
                    width: `${barraProgress}%`,
                    height: "20px",
                    backgroundColor:
                      barraProgress <= 33.33
                        ? "#e62e1b"
                        : (barraProgress > 33.33) & (barraProgress <= 66.66)
                          ? "#eaf937"
                          : barraProgress > 66.66
                            ? "#317f43"
                            : "white",
                  }}
                ></div>
              }
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {preguntas.map((pregunta, index) => (
              <div key={pregunta.id_pregunta} className="preguntas">
                <p>{pregunta.pregunta}</p>
                <div className="switch-container">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={pregunta.respuesta === 1}
                        onChange={(event) => handleSwitchChange(event, index)}
                        name={`switch-${pregunta.id_pregunta}`}
                        color="primary"
                      />
                    }
                    label={pregunta.respuesta === 1 ? "SI" : "NO"}
                  />
                </div>
              </div>
            ))}
            <div className="btn-container">
              <button className="btn-save" type="submit">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="informes-list">
        <div className="informes__content">
          <h2 className="title">Reports</h2>
          <button onClick={handleCrearInforme}>Create report</button>
        </div>
        <div className="card-container">
          {informes.length === 0 ? (
            <p className="description-length">No reports available</p>
          ) : (
            informes.map((informe) => (
              <div
                key={informe.informeId}
                className="informe-card"
                onClick={() => handleVerInforme(informe.informeId)}
                style={{
                  color:
                    preguntasConSi[informe.informeId] <= 33.33
                      ? "#e62e1b"
                      : (preguntasConSi[informe.informeId] > 33.33) &
                        (preguntasConSi[informe.informeId] <= 66.66)
                        ? "#C1CA49"
                        : preguntasConSi[informe.informeId] > 66.66
                          ? "#317f43"
                          : "white",
                  borderColor:
                    preguntasConSi[informe.informeId] <= 33.33
                      ? "#e62e1b"
                      : (preguntasConSi[informe.informeId] > 33.33) &
                        (preguntasConSi[informe.informeId] <= 66.66)
                        ? "#C1CA49"
                        : preguntasConSi[informe.informeId] > 66.66
                          ? "#317f43"
                          : "white",
                }}
              >
                <span>Created on</span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="120"
                  height="150"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V4C20 2.89543 19.1046 2 18 2Z" />
                  <path d="M14 2V6H18" />
                  <path d="M9 14H15" />
                  <path d="M9 18H15" />
                </svg>
                <span className="informe-createddate">
                  {new Date(informe.fechaCreacion).toLocaleString()}
                </span>
                <span>
                  {preguntasConSi[informe.informeId] <= 33.33
                    ? "Descalificado"
                    : (preguntasConSi[informe.informeId] > 33.33) &
                      (preguntasConSi[informe.informeId] <= 66.66)
                      ? "En progreso"
                      : preguntasConSi[informe.informeId] > 66.66
                        ? "Aceptado"
                        : "Error"}
                </span>
                <span>{preguntasConSiV2[informe.informeId]}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedInforme && (
        <div className="informe-respuestas">
          <span className="close-button" onClick={handleCerrarRespuestas}>
            X
          </span>
          <div className="container">
            <h2>Report</h2>
            <div className="grafico-linea">
              <div className="barra" style={{ height: "20px" }}></div>
              {
                <div
                  className="bar__progress"
                  style={{
                    width: `${calcularPorcentajes(
                      selectedInforme.respuestas
                    )}%`,
                    height: "20px",
                    backgroundColor:
                      calcularPorcentajes(selectedInforme.respuestas) <= 33.33
                        ? "#e62e1b"
                        : (calcularPorcentajes(selectedInforme.respuestas) >
                          33.33) &
                          (calcularPorcentajes(selectedInforme.respuestas) <=
                            66.66)
                          ? "#eaf937"
                          : calcularPorcentajes(selectedInforme.respuestas) >
                            66.66
                            ? "#317f43"
                            : "white",
                  }}
                ></div>
              }
            </div>
          </div>
          <p className="fecha">
            Report created on:{" "}
            {new Date(selectedInforme.fechaCreacion).toLocaleString()}
          </p>

          {selectedInforme.respuestas.map((respuesta) => (
            <div key={respuesta.id_respuesta} className="preguntas">
              <p>{respuesta.pregunta}</p>
              <p>{respuesta.respuesta ? "YES" : "NO"}</p>
            </div>
          ))}
          <div className="btn-container">
            <button className="btn-save" onClick={exportarAExcel}>
              Generate report in excel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
