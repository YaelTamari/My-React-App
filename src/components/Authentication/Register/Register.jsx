import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"; // בהנחה שהקונטקסט שלך נמצא כאן

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verify, setVerify] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (password !== verify) {
      setError("Passwords do not match");
      return;
    }

    // בדיקה אם המשתמש קיים
    const res = await fetch(
      `http://localhost:3001/users?username=${username}`
    );
    const users = await res.json();

    if (users.length > 0) {
      setError("Username already exists");
      return;
    }

    // שמירה זמנית ב-LocalStorage (או ב-Context)
    localStorage.setItem(
      "pendingUser",
      JSON.stringify({ username, password })
    );
    console.log("going to RegisterDetails");


    navigate("/register/details");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Register</h2>

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

        <input
          type="password"
          placeholder="Verify Password"
          value={verify}
          onChange={(e) => setVerify(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button type="botton" onClick={handleRegister}>Continue</button>
      </div>
    </div>
  );
};

export default Register;
