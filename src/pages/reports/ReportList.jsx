import axios from '../../api/axios';
import { useEffect, useState } from 'react'
import { GrFormView } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';

export const ReportList = () => {
    const [reports, setReports] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get('/report');
                if (Array.isArray(response.data.data)) {
                    setReports(response.data.data);
                } else {
                    console.error("La propiedad 'data' en la respuesta de la API no es un array:", response.data.data);
                }
            } catch (error) {
                console.error("Salio un error::", error);
            }
        };

        fetchReports();
    }, []);

    //formatear la fecha
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded">
        <table className="w-full text-md bg-white shadow-md rounded">
          <thead>
            <tr className="border-b border-[#27AAE1] h-12">
              <th className="text-left p-2">Fecha</th>
              <th className="text-left p-2">Reportes (Incidencia)</th>
              <th className="text-left p-2">Clave Catastral</th>
              <th className="text-left p-2">Estado</th>
              <th className="text-left p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <tr key={report.id} className="border-b border-[#27AAE1] hover:bg-gray-100 h-12">
                  <td className="font-normal text-gray-800 p-2">{formatDate(report.date)}</td>
                  <td className="p-2">{report.report}</td>
                  <td className="font-normal text-gray-800 p-2">{report.key}</td>
                  <td className="font-normal text-gray-800 p-2">{report.state.name}</td>
                  <td className="p-2">
                    <button
                      className="bg-[#27AAE1] hover:bg-[#1A6DAE] text-white font-bold py-1 px-2 rounded mr-2"
                      onClick={() => navigate(`/viewReport/${report.id}`)}
                    >
                      <GrFormView fontSize={30} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4">No hay reportes disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}