import NavBar from "../NavBar/NavBar"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Home.css";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="home-page">
      
      <header className="welcome-header">
        <h1>Welcome, {user.name}</h1>
         <NavBar />
      </header>

      {/* <div className="home-buttons">
        <button onClick={() => navigate("/info")}>Info</button>
        <button onClick={() => navigate("/todos")}>Todos</button>
        <button onClick={() => navigate("/posts")}>Posts</button>
        <button onClick={() => navigate("/albums")}>Albums</button>
        <button className="logout" onClick={logout}>Logout</button>
      </div> */}
    </div>
  );
};

export default Home;
