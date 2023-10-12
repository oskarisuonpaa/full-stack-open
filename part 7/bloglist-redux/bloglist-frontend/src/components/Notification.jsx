import { Alert } from "react-bootstrap";
import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector((state) => state.notification);

  if (!notification) return;

  return (
    <div>
      <Alert variant={notification.type === "error" ? "danger" : "success"}>
        {notification.message}
      </Alert>
    </div>
  );
};

export default Notification;
