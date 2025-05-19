import { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import axios from "../api/axios";
import "tailwindcss/tailwind.css";

export const AddComunicado = () => {
  const [comunicado, setComunicado] = useState({
    tittle: "",
    content: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { tittle, content } = comunicado;
    try {
      const response = await axios.post(
        "/communicate",
        {
          tittle,
          content,
          type_statement: "Comunicado",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("Éxito:", response.data);
      alert("Comunicado publicado con éxito");
      navigate("/comunicados");
    } catch (error) {
      if (error.response) {
        console.error("Error:", error.response.data.data);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-grow">
        <Header />
        <div className="p-10">
          <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-left text-gray-800">
              Nuevo Comunicado
            </h2>

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
                onChange={(e) =>
                  setComunicado({ ...comunicado, tittle: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingrese el título del Comunicado"
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
                onEditorChange={(content) =>
                  setComunicado({ ...comunicado, content })
                }
                init={{
                  height: 300,
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
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300"
              >
                Publicar
              </button>
              <button
                onClick={() => navigate("/comunicados")}
                className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition duration-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddComunicado;
