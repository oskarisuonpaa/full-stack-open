import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Button,
  Container,
  Nav,
  Navbar,
  NavbarCollapse,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { clearUser } from "../reducers/userReducer";

const NavigationBar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
    window.localStorage.removeItem("loggedBlogappUser");
  };

  const padding = { padding: 5 };

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="dark"
      variant="dark"
      style={padding}>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <LinkContainer to={"/"} style={padding}>
            <Nav.Link>blogs</Nav.Link>
          </LinkContainer>
          <LinkContainer to={"/users"} style={padding}>
            <Nav.Link>users</Nav.Link>
          </LinkContainer>
          <div style={padding}>
            <Navbar.Text>{user.name}</Navbar.Text>{" "}
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              logout
            </Button>
          </div>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
