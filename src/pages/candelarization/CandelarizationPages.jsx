import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import CandelarizationList from './CandelarizationList';

const CandelarizationPages = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-grow">
        <Header />
        <div className="p-4 max-w-5xl mx-auto">
          <CandelarizationList />
        </div>
      </div>
    </div>
  );
};

export default CandelarizationPages;
