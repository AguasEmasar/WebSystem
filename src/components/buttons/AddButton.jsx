const AddButton = ({ onClick }) => {
  return (
    <button
      className="text-white flex flex-col shrink-0 grow-0 justify-around fixed bottom-0 right-0 right-5 rounded-lg
                   mr-1 mb-5 lg:mr-5 lg:mb-5 xl:mr-10 xl:mb-10"
      onClick={onClick}
    >
      <div className="p-3 rounded-full border-4 border-white bg-[#1A6DAE] hover:bg-[#27AAE1] active:bg-[#1A6DAE] transition duration-200 ease-in-out">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="40"
          height="40"
          viewBox="0 0 24 24"
        >
          <path
            fill="#ffffff"
            fillRule="evenodd"
            d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z"
          ></path>
        </svg>
      </div>
    </button>
  );
};

export default AddButton;
