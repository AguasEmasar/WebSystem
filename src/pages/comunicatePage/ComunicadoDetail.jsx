import axios from "../../api/axios";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/buttons/BackButton";

export const ComunicadoDetail = ({ id }) => {
  const [comunicado, setComunicado] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComunicado = async () => {
      try {
        const response = await axios.get(
          `/communicate/${id}`
        );
        setComunicado(response.data.data);
      } catch (error) {
        console.error(
          "Error fetching comunicado:",
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchComunicado();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "2-digit" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  const findYouTubeLinks = (content) => {
    const youtubeLinkPattern = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([\w-]{11})|youtu\.be\/([\w-]{11})/g;
    let match;
    const urls = [];
    while ((match = youtubeLinkPattern.exec(content)) !== null) {
      urls.push(`https://www.youtube.com/watch?v=${match[1] || match[2]}`);
    }
    return urls;
  };

  if (!comunicado) {
    return (
      <div className="container mx-auto p-4 text-center text-gray-600">
        Cargando...
      </div>
    );
  }

  const sanitizedContent = DOMPurify.sanitize(comunicado.content, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
  });

  const videoUrls = findYouTubeLinks(comunicado.content);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl w-full mx-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Detalles del Comunicado
        </h1>
        {/* <button
          
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Regresar a la lista
        </button> */}
      <BackButton onClick={() => navigate(-1)} />

      </div>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 space-y-3">
          <div className="flex gap-2">
            <p className="font-semibold text-gray-900">Fecha:</p>
            <p className="text-gray-900">{formatDate(comunicado.date)}</p>
          </div>
          <div className="flex gap-2">
            <p className="font-semibold text-gray-900">Título:</p>
            <p className="text-gray-900">{comunicado.tittle}</p>
          </div>
          <div className="flex gap-2 flex-col">
            <p className="font-semibold text-gray-900">Contenido:</p>
            {videoUrls.length > 0 && (
              <div className="relative w-full aspect-w-16 aspect-h-9 mb-4">
                <ReactPlayer
                  url={videoUrls[0]}
                  controls
                  width="100%"
                  config={{
                    youtube: {
                      playerVars: {
                        modestbranding: 1,
                        rel: 0,
                      }
                    }
                  }}
                />
              </div>
            )}
            <div
              className="mr-2"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
