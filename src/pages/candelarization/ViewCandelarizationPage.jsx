import { useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import CalendarizationDetail from "./CandelarizationDetail";
const ViewCandelarizationPage = () => {
  const { id } = useParams();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-grow">
        <Header />
        <div className="p-4 max-w-4xl mx-auto">
          <CalendarizationDetail id={id} />
        </div>
      </div>
    </div>
  );
};

export default ViewCandelarizationPage;
