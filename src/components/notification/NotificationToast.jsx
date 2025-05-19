import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationToast = ({ notification, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => onClose(), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleClick = () => {
    if (!notification?.data) return;
    
    const { type, id } = notification.data;
    if (type === 'communicate') {
      navigate(`/comunicados/${id}`);
    } else if (type === 'water_schedule') {
      navigate(`/calendarizacion/${id}`);
    }
    onClose();
  };

  if (!notification) return null;

  return (
    <div 
      className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border-l-4 border-blue-500 max-w-sm z-50 cursor-pointer"
      onClick={handleClick}
    >
      <h3 className="font-bold text-lg">{notification.title}</h3>
      <p className="text-gray-700">{notification.body}</p>
      <span className="text-blue-500 text-sm hover:underline">Ver más</span>
    </div>
  );
};

export default NotificationToast;