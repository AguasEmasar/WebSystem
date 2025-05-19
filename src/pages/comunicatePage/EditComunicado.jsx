import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import "tailwindcss/tailwind.css";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import DOMPurify from "dompurify";

const EditComunicado = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [comunicado, setComunicado] = useState({
    tittle: "",
    content: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComunicado = async () => {
      try {
        const response = await axios.get(`/communicate/${id}`);
        const comunicadoData = response.data.data;

        setComunicado({
          tittle: comunicadoData.tittle || comunicadoData.tittle,
          content: comunicadoData.content,
        });
        setLoading(false);
      } catch (error) {
        console.error(
          "Error fetching comunicado:",
          error.response ? error.response.data : error.message
        );
        setLoading(false);
      }
    };

    fetchComunicado();
  }, [id]);

  const handleChange = (name, value) => {
    setComunicado({
      ...comunicado,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanedContent = DOMPurify.sanitize(comunicado.content);
      await axios.put(
        `/communicate/${id}`,
        {
          tittle: comunicado.tittle,
          content: cleanedContent,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/comunicados");
    } catch (error) {
      console.error(
        "Error updating comunicado:",
        error.response ? error.response.data : error.message
      );
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-grow">
        <Header />
        <div className="p-10">
          <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-left text-gray-800">
              Editar Comunicado
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4">
                <label
                  htmlFor="tittle"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Título:
                </label>
                <input
                  type="text"
                  id="tittle"
                  value={comunicado.tittle}
                  onChange={(e) => handleChange("tittle", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingrese el título del Comunicado"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="content"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Descripción:
                </label>
                <Editor
                  apiKey={import.meta.env.VITE_API_KEY}
                  value={comunicado.content}
                  onEditorChange={(content) => handleChange("content", content)}
                  init={{
                    height: 300,
                    menubar: true,
                    plugins: [
                      "advlist",
                      "autolink",
                      "link",
                      "image",
                      "lists",
                      "charmap",
                      "preview",
                      "anchor",
                      "pagebreak",
                      "searchreplace",
                      "wordcount",
                      "visualblocks",
                      "visualchars",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "emoticons",
                      "help",
                    ],
                    toolbar:
                      "undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media | forecolor backcolor emoticons",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                  className="border rounded-lg"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300"
                >
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/comunicados")}
                  className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition duration-300"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditComunicado;
