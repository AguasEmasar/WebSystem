import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { useParams } from "react-router-dom";
import { ReportDetail } from "./ReportDetail";

const ViewReportPage = () => {
  const { id } = useParams();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-grow">
        <Header />
        <div className="p-4 max-w-4xl mx-auto">
          <ReportDetail id={id} />
        </div>
      </div>
    </div>
  );
};

export default ViewReportPage;