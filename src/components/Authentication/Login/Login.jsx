import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!username || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      // בדיקה מול השרת
      const res = await fetch(
        `http://localhost:3001/users?username=${username}`
      );
      const users = await res.json();

      if (users.length === 0) {
        setError("User does not exist");
        return;
      }

      const userFromServer = users[0];

      // בדיקת סיסמה (לפי הדרישה – website)
      if (userFromServer.website !== password) {
        setError("Incorrect password");
        return;
      }

      // התחברות
      login(userFromServer);
      navigate("/home");

    } catch (err) {
      setError("Server error, please try again later");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button onClick={handleLogin}>Login</button>

        <p>
          Don’t have an account?
          <span onClick={() => navigate("/register")}> Register</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
