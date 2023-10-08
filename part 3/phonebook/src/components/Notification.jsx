const Notification = ({ notification }) => {
  if (notification.message === null) return;

  const style = {
    color: notification.type === "error" ? "red" : "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    padding: 10,
    marginBottom: 10,
  };

  return <div style={style}>{notification.message}</div>;
};

export default Notification;
