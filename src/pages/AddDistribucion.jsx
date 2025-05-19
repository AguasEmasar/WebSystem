import { useState } from "react";

const AddDistribucion = () => {
    const [distribucion, setDistribucion] = useState({
        nombre: "",
        direccion: "",
        telefono: "",
    });
    
    const handleChange = (e) => {
        setDistribucion({
        ...distribucion,
        [e.target.name]: e.target.value,
        });
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(distribucion);
    };
    
    return (
        <div>
        <h1>Agregar Distribucion</h1>
        <form onSubmit={handleSubmit}>
            <div>
            <label>Nombre</label>
            <input
                type="text"
                name="nombre"
                value={distribucion.nombre}
                onChange={handleChange}
            />
            </div>
            <div>
            <label>Direccion</label>
            <input
                type="text"
                name="direccion"
                value={distribucion.direccion}
                onChange={handleChange}
            />
            </div>
            <div>
            <label>Telefono</label>
            <input
                type="text"
                name="telefono"
                value={distribucion.telefono}
                onChange={handleChange}
            />
            </div>
            <button type="submit">Agregar</button>
        </form>
        </div>
    );
    };

export default AddDistribucion;