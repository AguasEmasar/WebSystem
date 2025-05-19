import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { ReportList } from "./ReportList";

const ListReportPage = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-grow">
        <Header />
        <div className="p-4 max-w-4xl mx-auto">
          <ReportList />
        </div>
      </div>
    </div>
  );
};

export default ListReportPage;
