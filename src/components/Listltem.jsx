import { useNavigate } from "react-router-dom";
import { FaRegFileAlt, FaRegCommentDots } from "react-icons/fa";

const ListItem = ({ item }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (item.type === "registro") {
            navigate(`/calendarizacion/${item.id}`);
        } else if (item.type === "comunicado") {
            navigate(`/comunicados/${item.id}`);
        }
    };

    return (
        <div
            className="p-4 border border-gray-200 rounded-lg mb-4 cursor-pointer hover:bg-gray-100"
            onClick={handleClick}
        >
            <div className="flex items-center">
                {item.type === "registro" ? (
                    <FaRegFileAlt className="mr-2 text-gray-700" size={24} />
                ) : (
                    <FaRegCommentDots className="mr-2 text-gray-700" size={24} />
                )}
                <span className="font-semibold text-gray-800">
                    {item.type === "registro" ? "Calendarización" : "Comunicado"}
                </span>
            </div>
            <p className="mt-2 text-gray-600">
                {new Date(item.date).toLocaleDateString()}
            </p>
        </div>
    );
};

export default ListItem;
