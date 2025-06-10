import axios from "../../api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  FileText,
  User,
  Phone,
  MapPin,
  Hash,
  CreditCard,
  MessageSquare,
  Image as ImageIcon,
  X,
  RefreshCw,
  AlertCircle,
  Download,
  ZoomIn,
  ChevronDown,
  Check,
} from "lucide-react";
import AssignButton from "../../components/buttons/AssignButton";

export const ReportDetail = ({ id }) => {
  const [report, setReport] = useState(null);
  const [states, setStates] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [changingState, setChangingState] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`/report/byid/${id}`);
        setReport(response.data.data);
      } catch (error) {
        console.error("Error fetching report:", error);
        setError("Error al cargar el reporte. Por favor intente nuevamente.");
      } finally {
        setLoading(false);
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
        console.error("Error fetching states:", error);
      }
    };
    fetchStates();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);

    const month = date.toLocaleDateString("es-ES", { month: "2-digit" });
    const day = date.toLocaleDateString("es-ES", { day: "2-digit" });
    const year = date.toLocaleDateString("es-ES", { year: "numeric" });

    return `${month}/${day}/${year}`;
  };

  const changeStateToSpecific = async (newStateId, newStateName) => {
    try {
      setChangingState(true);
      await axios.put(`/report/${id}/state/${newStateId}`, newStateId, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setReport((prevReport) => ({
        ...prevReport,
        state: {
          id: newStateId,
          name: newStateName,
        },
      }));

      setStateDropdownOpen(false);
    } catch (error) {
      console.error("Error changing state:", error);
      setError("Error al cambiar el estado. Por favor intente nuevamente.");
    } finally {
      setChangingState(false);
    }
  };

  // Keep the original changeState function for compatibility with AssignButton
  const changeState = async () => {
    try {
      const newState =
        report.state.name === "no asignado" ? "asignado" : "no asignado";
      const newStateId = states.find((state) => state.name === newState)?.id;

      if (!newStateId) {
        console.error("Estado no encontrado:", newState);
        return;
      }

      await changeStateToSpecific(newStateId, newState);
    } catch (error) {
      console.error("Error changing state:", error);
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage("");
  };

  const downloadImage = async (url, filename) => {
    try {
      const response = await axios.get(url, { responseType: "blob" });
      const urlBlob = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = urlBlob;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.error("Error al descargar la imagen:", error);
    }
  };

  const getStateStyle = (state) => {
    switch (state) {
      case "asignado":
        return "bg-green-100 text-green-700 border-green-200";
      case "pendiente":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "completado":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "no asignado":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStateIcon = (state) => {
    switch (state) {
      case "asignado":
        return "👤";
      case "pendiente":
        return "⏳";
      case "completado":
        return "✓";
      case "No asignado":
        return "✗";
      default:
        return "○";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando detalles del reporte...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Recargar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">No se encontró el reporte</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Detalle del Reporte
                </h1>
                <p className="text-gray-600">
                  Información completa de la incidencia
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Estado con dropdown */}
              <div className="relative">
                <button
                  onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
                  disabled={changingState}
                  className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center space-x-2 transition-all hover:shadow-md ${getStateStyle(
                    report.state?.name
                  )} ${
                    changingState
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <span>{getStateIcon(report.state?.name)}</span>
                  <span>{report.state?.name || "N/A"}</span>
                  {changingState ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>

                {/* Dropdown de estados */}
                {stateDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b">
                        Cambiar Estado
                      </div>
                      {states.map((state) => (
                        <button
                          key={state.id}
                          onClick={() =>
                            changeStateToSpecific(state.id, state.name)
                          }
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between transition-colors ${
                            report.state?.name === state.name
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-700"
                          }`}
                          disabled={changingState}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">
                              {getStateIcon(state.name)}
                            </span>
                            <div>
                              <div className="font-medium capitalize">
                                {state.name}
                              </div>
                              {state.description && (
                                <div className="text-xs text-gray-500">
                                  {state.description}
                                </div>
                              )}
                            </div>
                          </div>
                          {report.state?.name === state.name && (
                            <Check className="w-4 h-4 text-blue-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <AssignButton report={report} changeState={changeState} />
            </div>
          </div>
        </div>

        {/* Click outside to close dropdown */}
        {stateDropdownOpen && (
          <div
            className="fixed inset-0 z-5"
            onClick={() => setStateDropdownOpen(false)}
          ></div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información del Reporte */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                Información del Reporte
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Fecha</p>
                    <p className="font-medium text-gray-900 font-mono">
                      {formatDate(report.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Clave Catastral</p>
                    <p className="font-medium text-gray-900 font-mono">
                      {report.key || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Descripción</p>
                    <p className="font-medium text-gray-900 font-mono">
                      {report.report}
                    </p>
                  </div>
                </div>
                {report.observation && (
                  <div className="flex items-start space-x-3">
                    <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Observación</p>
                      <p className="font-medium text-gray-900 font-mono">
                        {report.observation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Imágenes */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-indigo-600" />
                Imágenes del Reporte
              </h2>
              {/* Imagen principal */}
              {report.url && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3">Imagen principal</p>
                  <div className="relative group inline-block">
                    <img
                      src={report.url}
                      alt="Imagen principal del reporte"
                      className="w-64 h-48 object-cover rounded-lg border cursor-pointer transition-transform hover:scale-105"
                      onClick={() => openImageModal(report.url)}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                        <button
                          onClick={() => openImageModal(report.url)}
                          className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
                        >
                          <ZoomIn className="w-4 h-4 text-gray-700" />
                        </button>
                        <button
                          onClick={() =>
                            downloadImage(
                              report.url,
                              `reporte-${id}-principal.jpg`
                            )
                          }
                          className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
                        >
                          <Download className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Galería de imágenes adicionales */}
              {Array.isArray(report.urls) && report.urls.length > 0 ? (
                <div>
                  <p className="text-sm text-gray-600 mb-3">
                    Imágenes adicionales
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {report.urls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Imagen ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border cursor-pointer transition-transform hover:scale-105"
                          onClick={() => openImageModal(url)}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
                            <button
                              onClick={() => openImageModal(url)}
                              className="bg-white rounded-full p-1.5 shadow-lg hover:bg-gray-50"
                            >
                              <ZoomIn className="w-3 h-3 text-gray-700" />
                            </button>
                            <button
                              onClick={() =>
                                downloadImage(
                                  url,
                                  `reporte-${id}-${index + 1}.jpg`
                                )
                              }
                              className="bg-white rounded-full p-1.5 shadow-lg hover:bg-gray-50"
                            >
                              <Download className="w-3 h-3 text-gray-700" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                !report.url && (
                  <div className="text-center py-12">
                    <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No hay imágenes disponibles</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Información Personal */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-indigo-600" />
                Información del Reportante
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Nombre</p>
                    <p className="font-medium text-gray-900 font-mono">
                      {report.name || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">DNI</p>
                    <p className="font-medium text-gray-900 font-mono">
                      {report.dni || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <p className="font-medium text-gray-900 font-mono">
                      {report.cellphone || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Dirección</p>
                    <p className="font-medium text-gray-900 font-mono">
                      {report.direction || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal para ver imágenes */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={closeModal}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <img
                src={selectedImage}
                alt="Imagen ampliada"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <div className="absolute bottom-4 right-4">
                <button
                  onClick={() =>
                    downloadImage(selectedImage, `imagen-reporte-${id}.jpg`)
                  }
                  className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 rounded-full p-2 shadow-lg transition-all"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
