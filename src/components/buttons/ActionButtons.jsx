const ActionButtons = ({ onPublish, onCancel }) => {
  return (
    <div className="flex space-x-4">
      <button
        className="bg-[#27AAE1] text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        onClick={onPublish}
      >
        Publicar
      </button>
      <button
        onClick={onCancel}
        className="bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
      >
        Cancelar
      </button>
    </div>
  );
};

export default ActionButtons;
