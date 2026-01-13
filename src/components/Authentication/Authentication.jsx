import { useNavigate } from "react-router-dom";
import "./Authentication.css";

const Authentication = () => {
  const navigate = useNavigate();

  return (
    <div className="authentication-container">
      <h2>Welcome</h2>

      <div className="auth-buttons-group">
        <button onClick={() => navigate("/login")}>
          Login
        </button>

        <button onClick={() => navigate("/register")}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Authentication;
