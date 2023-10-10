const Notification = ({ notification }) => {
  if (!notification.message) return;

  const style = {
    color: notification.type === "error" ? "red" : "green",
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  };

  return <div style={style}>{notification.message}</div>;
};

export default Notification;
