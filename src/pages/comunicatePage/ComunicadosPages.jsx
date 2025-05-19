import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import ComunicadoList from './ComunicadoList';

const ComunicadosPage = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-grow">
        <Header />
        <div className="p-4 max-w-4xl mx-auto">
          <ComunicadoList />
        </div>
      </div>
    </div>
  );
};

export default ComunicadosPage;