import { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
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
      resuelto: 0,
      noResuelto: 0,
    },
    incidenciasPorFecha: {
      labels: [],
      datasets: [
        {
          label: "Incidencias por Fecha",
          data: [],
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
        },
      ],
    },
    reportesPorMes: {
      labels: [],
      datasets: [
        {
          label: "Número de Reportes",
          data: [],
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
      ],
    },
    incidenciaComun: {
      labels: [],
      datasets: [
        {
          label: "Tipo de Incidencia",
          data: [],
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
      ],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
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

        // Incidencias por fecha
        const incidenciasPorFecha = responseData.reduce((acc, report) => {
          const date = new Date(report.date).toLocaleDateString("es-ES");
          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date]++;
          return acc;
        }, {});
        const dates = Object.keys(incidenciasPorFecha);
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

        //Tipo de incidencia o reporte más comun
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
          },
          incidenciasPorFecha: {
            labels: dates,
            datasets: [
              {
                label: "Incidencias por Fecha",
                data: counts,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
              },
            ],
          },
          reportesPorMes: {
            labels: sortedMonths,
            datasets: [
              {
                label: "Número de Reportes",
                // data: sortedMonths.map((month) => reportesPorMes[month]),
                data: conteosMeses,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
              },
            ],
          },

          incidenciaComun: {
            labels: tipos,
            datasets: [
              {
                label: "Tipo de Incidencia",
                data: conteosTipos,
                backgroundColor: tipos.map(
                  () =>
                    `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                      Math.random() * 255
                    )}, ${Math.floor(Math.random() * 255)}, 0.6)`
                ),
              },
            ],
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const accionesData = {
    labels: ["Asignado", "No Asignado"],
    datasets: [
      {
        label: "Número de Acciones",
        data: [data.acciones.resuelto, data.acciones.noResuelto],
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 99, 132, 0.6)"],
      },
    ],
  };

  return (
    <div className="flex h-screen">
      <Sidebar className="w-64 h-full" />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-4 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Estadísticas</h1>
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <div className="bg-white p-6 shadow rounded-lg">
              <h2 className="text-xl mb-4">Total de Reportes</h2>
              <div style={{ height: "400px" }} className="counter">
                <p className="text-3xl font-bold">{data.incidencias}</p>
              </div>
            </div>
            <div className="bg-white p-6 shadow rounded-lg">
              <h2 className="text-xl mb-4">Estado de Incidencias</h2>
              <div style={{ height: "400px" }}>
                <Pie
                  data={accionesData}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
            </div>
            <div className="bg-white p-6 shadow rounded-lg">
              <h2 className="text-xl mb-4">Incidencias por Fecha</h2>
              <div style={{ height: "400px" }}>
                <Line
                  data={data.incidenciasPorFecha}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
            </div>
            <div className="bg-white p-6 shadow rounded-lg">
              <h2 className="text-xl mb-4">Reportes por Mes</h2>
              <div style={{ height: "400px" }}>
                <Bar
                  data={data.reportesPorMes}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
            </div>
            <div className="bg-white p-6 shadow rounded-lg">
              <h2 className="text-xl mb-4">Tipo de Incidencia más Común</h2>
              <div style={{ height: "400px" }}>
                <Bar
                  data={data.incidenciaComun}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EstadisticasPage;
