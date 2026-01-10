import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const RegisterDetails = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // סטייט לכל השדות הנדרשים
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // כאן password = website לפי דרישות הקורס
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [suite, setSuite] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [catchPhrase, setCatchPhrase] = useState("");
  const [bs, setBs] = useState("");

  const [error, setError] = useState("");

  // טעינת נתונים מהשלב הראשון של ההרשמה
  useEffect(() => {
    const pendingUser = JSON.parse(localStorage.getItem("pendingUser"));
    if (!pendingUser) {
      navigate("/register");
      return;
    }
    setUsername(pendingUser.username);
    setPassword(pendingUser.password);
  }, [navigate]);

  const handleRegister = async () => {
    setError("");

    // בדיקה שכל השדות מלאים
    if (
      !name || !email || !street || !suite || !city || !zipcode ||
      !lat || !lng || !phone || !website || !companyName || !catchPhrase || !bs
    ) {
      setError("יש למלא את כל השדות");
      return;
    }

    const newUser = {
      username,
      website: password,
      name,
      email,
      address: {
        street,
        suite,
        city,
        zipcode,
        geo: { lat, lng }
      },
      phone,
      company: {
        name: companyName,
        catchPhrase,
        bs
      }
    };

    try {
      const res = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      // --- השינוי המבוקש כאן ---
      // קבלת המשתמש המלא מהשרת הכולל את ה-ID האמיתי
      const registeredUser = await res.json();

      // הסרת המשתמש הזמני
      localStorage.removeItem("pendingUser");

      // שליחת המשתמש עם ה-ID לתוך פונקציית ה-login ששומרת ל-LocalStorage
      login(registeredUser);
      // -------------------------

      navigate(`/users/${registeredUser.id}/home`);
    } catch (err) {
      setError("שגיאה בשרת, נסי שוב");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>השלמת רישום</h2>

        <input value={username} disabled />
        <input type="password" value={password} disabled />

        <input placeholder="שם מלא" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Street" value={street} onChange={(e) => setStreet(e.target.value)} />
        <input placeholder="Suite" value={suite} onChange={(e) => setSuite(e.target.value)} />
        <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <input placeholder="Zipcode" value={zipcode} onChange={(e) => setZipcode(e.target.value)} />
        <input placeholder="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} />
        <input placeholder="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} />
        <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input placeholder="Website" value={website} onChange={(e) => setWebsite(e.target.value)} />
        <input placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        <input placeholder="Catch Phrase" value={catchPhrase} onChange={(e) => setCatchPhrase(e.target.value)} />
        <input placeholder="BS" value={bs} onChange={(e) => setBs(e.target.value)} />

        {error && <p className="error">{error}</p>}

        <button onClick={handleRegister}>סיום רישום</button>
      </div>
    </div>
  );
};

export default RegisterDetails;