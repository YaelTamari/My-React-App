// import NavBar from "../NavBar/NavBar"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Home.css";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="home-page">
      
      <header className="welcome-header">
        <h1>Welcome, {user.username}</h1>
         {/* <NavBar /> */}
      </header>

    </div>
  );
};

export default Home;