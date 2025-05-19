import { useEffect } from "react";
import { setupNotifications } from "../firebase-config";

const NotificationHandler = ({ setNotification }) => {
  useEffect(() => {
    const handleNotification = (message) => {
      setNotification({
        title: message.title,
        body: message.body,
        data: message.data,
      });
    };

    setupNotifications(handleNotification);
  }, []);

  return null;
};

export default NotificationHandler;
