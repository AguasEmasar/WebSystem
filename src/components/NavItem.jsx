export const NavItem = ({ icon, title, onClick, open }) => (
  <li
    className="text-black text-sm flex items-center cursor-pointer p-2 hover:bg-[#EBF4F6] rounded-md mt-2 transition-all duration-300 z-50"
    onClick={onClick}
  >
    <span
      className={`text-2xl transition-transform duration-300 ${
        open ? "opacity-100 scale-100" : "opacity-100 scale-90"
      }`}
    >
      {icon}
    </span>
    <span
      className={`ml-4 transition-opacity duration-300 ${
        open ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="text-lg">{title}</span>
    </span>
  </li>
);
