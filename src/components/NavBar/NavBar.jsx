import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
 import "./NavBar.css";

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navTo = (path) => navigate(`/users/${user.id}${path}`);

  return (
    <nav className="navbar">
      
      <span className="navbar-buttons">
        <button onClick={() => navTo("/info")}>Info</button>
        <button onClick={() => navTo("/todos")}>Todos</button>
        <button onClick={() => navTo("/posts")}>Posts</button>
        <button onClick={() => navTo("/albums")}>Albums</button>
        <button className="logout" onClick={logout}>Logout</button>
      </span>
    </nav>
  );
};

export default NavBar;