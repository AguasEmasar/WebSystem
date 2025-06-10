import { useEffect, useState } from "react";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import axios from "../api/axios";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement
);

const EstadisticasPage = () => {
  const [data, setData] = useState({
    incidencias: 0,
    acciones: {
      Completado: 0,
      Asignado: 0,
      Pendiente: 0,
      NoAsignado: 0,
    },
    incidenciasPorFecha: {
      labels: [],
      datasets: [
        {
          label: "Incidencias por Fecha",
          data: [],
          borderColor: "rgba(59, 130, 246, 1)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
        },
      ],
    },
    reportesPorMes: {
      labels: [],
      datasets: [
        {
          label: "Número de Reportes",
          data: [],
          backgroundColor: "rgba(16, 185, 129, 0.8)",
          borderColor: "rgba(16, 185, 129, 1)",
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    },
    incidenciaComun: {
      labels: [],
      datasets: [
        {
          label: "Tipo de Incidencia",
          data: [],
          backgroundColor: [
            "rgba(59, 130, 246, 0.8)",
            "rgba(16, 185, 129, 0.8)",
            "rgba(245, 158, 11, 0.8)",
            "rgba(239, 68, 68, 0.8)",
            "rgba(139, 92, 246, 0.8)",
            "rgba(236, 72, 153, 0.8)",
          ],
          borderColor: [
            "rgba(59, 130, 246, 1)",
            "rgba(16, 185, 129, 1)",
            "rgba(245, 158, 11, 1)",
            "rgba(239, 68, 68, 1)",
            "rgba(139, 92, 246, 1)",
            "rgba(236, 72, 153, 1)",
          ],
          borderWidth: 2,
        },
      ],
    },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/report");
        const responseData = response.data.data || [];

        // Total de incidencias
        const totalIncidencias = responseData.length;

        // Acciones (Asignado vs No Asignado)
        const resueltos = responseData.filter(
          (a) =>
            a.state && a.state.name && a.state.name.toLowerCase() === "asignado"
        ).length;
        const noResueltos = responseData.filter(
          (a) =>
            a.state &&
            a.state.name &&
            a.state.name.toLowerCase() === "no asignado"
        ).length;
        const pendientes = responseData.filter(
          (a) =>
            a.state &&
            a.state.name &&
            a.state.name.toLowerCase() === "pendiente"
        ).length;
        const completados = responseData.filter(
          (a) =>
            a.state &&
            a.state.name &&
            a.state.name.toLowerCase() === "completado"
        ).length;

        // Incidencias por fecha
        const incidenciasPorFecha = responseData.reduce((acc, report) => {
          const date = new Date(report.date).toLocaleDateString("es-ES");
          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date]++;
          return acc;
        }, {});
        const dates = Object.keys(incidenciasPorFecha).sort(
          (a, b) =>
            new Date(a.split("/").reverse().join("-")) -
            new Date(b.split("/").reverse().join("-"))
        );
        const counts = dates.map((date) => incidenciasPorFecha[date]);

        // Reportes por mes
        const reportesPorMes = responseData.reduce((acc, report) => {
          const date = new Date(report.date);
          const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
          if (!acc[monthYear]) {
            acc[monthYear] = 0;
          }
          acc[monthYear]++;
          return acc;
        }, {});
        const sortedMonths = Object.keys(reportesPorMes).sort((a, b) => {
          const [monthA, yearA] = a.split("/");
          const [monthB, yearB] = b.split("/");
          return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
        });
        const conteosMeses = sortedMonths.map((mes) => reportesPorMes[mes]);

        //Tipo de incidencia o reporte más común
        const incidenciaComun = responseData.reduce((acc, report) => {
          const tipo = report.report || "Sin especificar";
          if (!acc[tipo]) {
            acc[tipo] = 0;
          }
          acc[tipo]++;
          return acc;
        }, {});
        const tipos = Object.keys(incidenciaComun);
        const conteosTipos = Object.values(incidenciaComun);

        setData({
          incidencias: totalIncidencias,
          acciones: {
            resuelto: resueltos,
            noResuelto: noResueltos,
            pendiente: pendientes,
            completado: completados,
          },
          incidenciasPorFecha: {
            labels: dates,
            datasets: [
              {
                label: "Incidencias por Fecha",
                data: counts,
                borderColor: "rgba(59, 130, 246, 1)",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "rgba(59, 130, 246, 1)",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointRadius: 5,
              },
            ],
          },
          reportesPorMes: {
            labels: sortedMonths,
            datasets: [
              {
                label: "Número de Reportes",
                data: conteosMeses,
                backgroundColor: "rgba(16, 185, 129, 0.8)",
                borderColor: "rgba(16, 185, 129, 1)",
                borderWidth: 1,
                borderRadius: 6,
              },
            ],
          },
          incidenciaComun: {
            labels: tipos,
            datasets: [
              {
                label: "Tipo de Incidencia",
                data: conteosTipos,
                backgroundColor: tipos.map((_, index) => {
                  const colors = [
                    "rgba(59, 130, 246, 0.8)",
                    "rgba(16, 185, 129, 0.8)",
                    "rgba(245, 158, 11, 0.8)",
                    "rgba(239, 68, 68, 0.8)",
                    "rgba(139, 92, 246, 0.8)",
                    "rgba(236, 72, 153, 0.8)",
                  ];
                  return colors[index % colors.length];
                }),
                borderColor: tipos.map((_, index) => {
                  const colors = [
                    "rgba(59, 130, 246, 1)",
                    "rgba(16, 185, 129, 1)",
                    "rgba(245, 158, 11, 1)",
                    "rgba(239, 68, 68, 1)",
                    "rgba(139, 92, 246, 1)",
                    "rgba(236, 72, 153, 1)",
                  ];
                  return colors[index % colors.length];
                }),
                borderWidth: 2,
              },
            ],
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const accionesData = {
    labels: ["Asignado", "No Asignado", "Pendiente", "completado"],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            usePointStyle: true,
            font: {
              size: 12,
              weight: "500",
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#fff",
          bodyColor: "#fff",
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
        },
      },
      cutout: "70%",
    },
    datasets: [
      {
        label: "Estado de Incidencias",
        data: [
          data.acciones.resuelto,
          data.acciones.noResuelto,
          data.acciones.pendiente,
          data.acciones.completado,
        ],
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(139, 92, 246, 0.8)",
        ],
        borderColor: [
          "rgba(16, 185, 129, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(139, 92, 246, 1)",
        ],
        hoverOffset: 4,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          font: {
            size: 12,
            weight: "500",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: "500",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
  };

  const StatCard = ({ title, value, subtitle, color = "blue" }) => {
    const colorClasses = {
      blue: "from-blue-600 to-blue-500",
      green: "from-green-600 to-green-500",
      yellow: "from-yellow-600 to-yellow-500",
      red: "from-red-600 to-red-500",
      purple: "from-purple-600 to-purple-500",
    };

    return (
      <div
        className={`bg-gradient-to-r ${colorClasses[color]} p-6 rounded-xl text-white shadow-lg transform hover:scale-105 transition-transform duration-200`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {subtitle && <p className="text-sm opacity-75 mt-1">{subtitle}</p>}
          </div>
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-full opacity-60"></div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar className="w-64 h-full" />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }
  // calcular para el 100% de acciones
  const totalAcciones =
    data.incidencias > 0
      ? (
          ((data.acciones.resuelto +
            data.acciones.noResuelto +
            data.acciones.pendiente +
            data.acciones.completado) /
            data.incidencias) *
          100
        ).toFixed(1)
      : 0;
  const resolutionRate =
    data.incidencias > 0
      ? ((data.acciones.resuelto / data.incidencias) * 100).toFixed(1)
      : 0;
  const pendingRate =
    data.acciones.pendiente > 0
      ? ((data.acciones.pendiente / data.incidencias) * 100).toFixed(1)
      : 0;
  const completedRate =
    data.acciones.completado > 0
      ? ((data.acciones.completado / data.incidencias) * 100).toFixed(1)
      : 0;
  const noAssignedRate =
    data.acciones.noResuelto > 0
      ? ((data.acciones.noResuelto / data.incidencias) * 100).toFixed(1)
      : 0;

  // const resolutionRate =
  //   data.incidencias > 0
  //     ? ((data.acciones.resuelto / data.incidencias) * 100).toFixed(1)
  //     : 0;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar className="w-64 h-full" />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Panel de Estadísticas
            </h1>
            <p className="text-gray-600">
              Análisis completo de incidencias y reportes del sistema
            </p>
          </div>

          {/* Cards de Resumen */}
          <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Resumen Analítico
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Total de Reportes"
                value={data.incidencias}
                subtitle={`${totalAcciones}% del total`}
                color="purple"
              />
              <StatCard
                title="Reportes Asignados"
                value={data.acciones.resuelto}
                subtitle={`${resolutionRate}% del total`}
                color="green"
              />
              <StatCard
                title="Pendientes"
                value={data.acciones.pendiente}
                subtitle={`${pendingRate}% del total`}
                color="yellow"
              />
              <StatCard
                title="Reportes Completados"
                value={data.acciones.completado}
                subtitle={`${completedRate}% del total`}
                color="blue"
              />
              <StatCard
                title="Reportes no Asignados"
                value={data.acciones.noResuelto}
                subtitle={`${noAssignedRate}% del total`}
                color="red"
              />
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 mt-8">
            {/* Estado de Incidencias */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Estado de Incidencias
                </h2>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div style={{ height: "300px" }}>
                <Doughnut data={accionesData} options={pieOptions} />
              </div>
            </div>

            {/* Tendencia Mensual */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Tendencia Mensual
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Reportes por Mes
                  </span>
                </div>
              </div>
              <div style={{ height: "300px" }}>
                <Bar data={data.reportesPorMes} options={chartOptions} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Evolución Temporal */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Evolución por Fecha
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Incidencias Diarias
                  </span>
                </div>
              </div>
              <div style={{ height: "350px" }}>
                <Line data={data.incidenciasPorFecha} options={chartOptions} />
              </div>
            </div>

            {/* Tipos de Incidencias */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Tipos de Incidencias
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Categorías</span>
                </div>
              </div>
              <div style={{ height: "350px" }}>
                <Bar data={data.incidenciaComun} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Resumen de Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-medium text-green-600">Total de Reportes</p>
                <p>{data.incidencias} incidencias registradas en el sistema</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-medium text-blue-600">Tasa de completado</p>
                <p>{completedRate}% de los reportes han sido completados</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-medium text-purple-600">Categorías</p>
                <p>
                  {data.incidenciaComun.labels.length} tipos diferentes de
                  incidencias
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EstadisticasPage;
