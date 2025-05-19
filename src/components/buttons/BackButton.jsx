const BackButton = ({ onClick }) => {
  return (
    <button
      className="text-white flex flex-col right-5 rounded-lg mr-1 mb-5"
      onClick={onClick}
    >
      <div className="px-3 py-3 rounded-full bg-[#27AAE1] hover:bg-[#1A6DAE] active:bg-[#1A6DAE] transition duration-200 ease-in-out">
        <svg
          fill="#ffffff"
          version="1.1"
          id="Layer_1"
          width="26"
          height="26"
          viewBox="0 0 72 72"
          enableBackground="new 0 0 72 72"
          xmlSpace="preserve"
          stroke="#ffffff"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <g>
              {" "}
              <path d="M48.252,69.253c-2.271,0-4.405-0.884-6.011-2.489L17.736,42.258c-1.646-1.645-2.546-3.921-2.479-6.255 c-0.068-2.337,0.833-4.614,2.479-6.261L42.242,5.236c1.605-1.605,3.739-2.489,6.01-2.489c2.271,0,4.405,0.884,6.01,2.489 c3.314,3.314,3.314,8.707,0,12.021L35.519,36l18.743,18.742c3.314,3.314,3.314,8.707,0,12.021 C52.656,68.369,50.522,69.253,48.252,69.253z M48.252,6.747c-1.202,0-2.332,0.468-3.182,1.317L21.038,32.57 c-0.891,0.893-0.833,2.084-0.833,3.355c0,0.051,0,0.101,0,0.151c0,1.271-0.058,2.461,0.833,3.353l24.269,24.506 c0.85,0.85,1.862,1.317,3.063,1.317c1.203,0,2.273-0.468,3.123-1.317c1.755-1.755,1.725-4.61-0.03-6.365L31.292,37.414 c-0.781-0.781-0.788-2.047-0.007-2.828L51.438,14.43c1.754-1.755,1.753-4.61-0.001-6.365C50.587,7.215,49.454,6.747,48.252,6.747z"></path>{" "}
            </g>{" "}
          </g>
        </svg>
      </div>
    </button>
  );
};

export default BackButton;
