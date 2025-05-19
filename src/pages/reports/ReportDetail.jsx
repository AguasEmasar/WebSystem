import { Modal } from "antd";
import axios from "../../api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "antd/dist/reset.css";
import BackButton from "../../components/buttons/BackButton";
import AssignButton from "../../components/buttons/AssignButton";

export const ReportDetail = ({ id }) => {
  const [report, setReport] = useState(null);
  const [states, setStates] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`/report/byid/${id}`);
        setReport(response.data.data);
      } catch (error) {
        console.error(
          "Error fetching report:",
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchReport();
  }, [id]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get("/state");
        setStates(response.data.data);
      } catch (error) {
        console.error(
          "Error fetching states:",
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchStates();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "2-digit" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  const changeState = async () => {
    try {
      const newState =
        report.state.name === "no asignado" ? "asignado" : "no asignado";
      const newStateId = states.find((state) => state.name === newState)?.id;

      if (!newStateId) {
        console.error("Estado no encontrado:", newState);
        return;
      }

      await axios.put(`/report/${id}/state/${newStateId}`, newStateId, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setReport((prevReport) => ({
        ...prevReport,
        state: { name: newState },
      }));
    } catch (error) {
      console.error(
        "Error changing state:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  if (!report) {
    return <div className="container mx-auto p-4">Cargando...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Detalles del Reporte
        </h1>
        <div className="flex space-x-2">
          <AssignButton report={report} changeState={changeState} />
          <BackButton onClick={() => navigate(-1)} />
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <p>
            <strong>Fecha:</strong> {formatDate(report.date)}
          </p>
          <p>
            <strong>Reporte:</strong> {report.report}
          </p>
          <p>
            <strong>Clave Catastral:</strong> {report.key}
          </p>
          <p>
            <strong>Nombre:</strong> {report.name}
          </p>
          <p>
            <strong>DNI:</strong> {report.dni}
          </p>
          <p>
            <strong>Teléfono:</strong> {report.cellphone}
          </p>
          <p>
            <strong>Dirección:</strong> {report.direction}
          </p>
          <p>
            <strong>Estado:</strong> {report.state.name}
          </p>
          <p>
            <strong>Observación:</strong> {report.observation}
          </p>

          {/* Parte del Jeffrey */}
          <p className="font-semibold mb-2">Imagenes:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.isArray(report.urls) && report.urls.length > 0 ? (
              report.urls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Reporte imagen: ${index + 1}`}
                  className="w-full max-w-lg mx-auto rounded-lg shadow-md"
                />
              ))
            ) : (
              <p>No hay imágenes disponibles.</p>
            )}
          </div>
        </div>
        {report.url && (
          <div className="mb-6">
            <p className="font-bold mb-2">Imagen del reporte</p>
            <img
              src={report.url}
              alt="Reporte"
              className="w-[200px] h-auto max-w-3xl rounded-lg shadow-md object-contain cursor-pointer"
              onClick={openModal}
            />
          </div>
        )}
      </div>
      <Modal
        open={modalOpen}
        onCancel={closeModal}
        footer={null}
        className="modal-image"
        closeIcon={
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="text-green-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        }
      >
        <img
          src={report.url}
          alt="Reporte"
          className="w-full h-auto object-contain rounded-lg"
        />
      </Modal>
    </div>
  );
};
