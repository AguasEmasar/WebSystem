import axios from "../../api/axios";
import { useEffect, useState } from "react";
import {
  Download,
  FileText,
  Receipt,
  Search,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { GrFormView } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

export const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [filteredReceipts, setFilteredReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("reportes");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [reportsResponse, receiptsResponse] = await Promise.all([
          axios.get("/report"),
          axios.get("/UploadReceipt/all"),
        ]);
        const reportsData = Array.isArray(reportsResponse.data.data)
          ? reportsResponse.data.data
          : [];
        const receiptsData = Array.isArray(receiptsResponse.data.data)
          ? receiptsResponse.data.data
          : [];

        setReports(reportsData);
        setReceipts(receiptsData);
        setFilteredReports(reportsData);
        setFilteredReceipts(receiptsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error al cargar los datos. Por favor intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtrar datos cuando cambie el término de búsqueda
  useEffect(() => {
    if (activeTab === "reportes") {
      let filtered = reports;
      if (searchTerm) {
        filtered = filtered.filter(
          (report) =>
            report.report?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.key?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      setFilteredReports(filtered);
    } else {
      let filtered = receipts;
      if (searchTerm) {
        filtered = filtered.filter((receipt) =>
          receipt.clave?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      setFilteredReceipts(filtered);
    }
  }, [searchTerm, activeTab, reports, receipts]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando datos...</p>
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

  const currentData =
    activeTab === "reportes" ? filteredReports : filteredReceipts;
  const currentCount =
    activeTab === "reportes" ? reports.length : receipts.length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                {activeTab === "reportes" ? (
                  <FileText className="w-6 h-6 text-indigo-600" />
                ) : (
                  <Receipt className="w-6 h-6 text-indigo-600" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeTab === "reportes"
                    ? "Reportes de Incidencias"
                    : "Comprobantes de Pago"}
                </h1>
                <p className="text-gray-600">
                  {activeTab === "reportes"
                    ? "Gestiona las incidencias reportadas"
                    : "Visualiza los comprobantes registrados"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600">
                {currentCount}
              </div>
              <div className="text-gray-500 text-sm">
                {activeTab === "reportes" ? "Reportes" : "Comprobantes"}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab("reportes")}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-colors ${
                activeTab === "reportes"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Reportes</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                {reports.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("comprobantes")}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-colors ${
                activeTab === "comprobantes"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Comprobantes</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                {receipts.length}
              </span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={`Buscar ${
                activeTab === "reportes" ? "reportes" : "comprobantes"
              }...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {activeTab === "reportes" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Incidencia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clave
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(report.date)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="max-w-xs">
                            <p className="truncate">{report.report}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-indigo-600">
                          {report.key}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStateStyle(
                              report.state?.name
                            )}`}
                          >
                            {report.state?.name || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => navigate(`/viewReport/${report.id}`)}
                            className="bg-[#27AAE1] hover:bg-[#1A6DAE] text-white font-bold py-1 px-2 rounded mr-2"
                          >
                            <GrFormView fontSize={30} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">
                          No hay reportes disponibles
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clave
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comprobantes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredReceipts.length > 0 ? (
                    filteredReceipts.map((receipt) => (
                      <tr key={receipt.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(receipt.fechaSubida)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-indigo-600">
                          {receipt.clave}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {receipt.urls?.map((url, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={url}
                                  alt={`Comprobante ${index + 1}`}
                                  className="w-16 h-16 object-cover rounded-lg border"
                                />
                                <button
                                  onClick={() =>
                                    downloadImage(
                                      url,
                                      `comprobante-${receipt.clave}-${
                                        index + 1
                                      }.jpg`
                                    )
                                  }
                                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-lg transition-all"
                                >
                                  <Download className="w-4 h-4 text-white opacity-0 group-hover:opacity-100" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-12 text-center">
                        <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">
                          No hay comprobantes disponibles
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
