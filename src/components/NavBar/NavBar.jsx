import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
 import "./NavBar.css";

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      
      <span className="navbar-buttons">
        <button onClick={() => navigate("/info")}>Info</button>
        <button onClick={() => navigate("/todos")}>Todos</button>
        <button onClick={() => navigate("/posts")}>Posts</button>
        <button onClick={() => navigate("/albums")}>Albums</button>
        <button className="logout" onClick={logout}>Logout</button>
      </span>
    </nav>
  );
};

export default NavBar;
