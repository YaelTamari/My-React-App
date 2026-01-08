import NavBar from "../../NavBar/NavBar"
import { useAuth } from "../../../context/AuthContext";
import "./Info.css"; // אל תשכחי ליצור את הקובץ הזה

const Info = () => {
  const { user } = useAuth();

  if (!user) return <p>Loading user data...</p>;

  return (
    <div className="info-container page-content">
       <NavBar />
      <div className="profile-card">
        {/* ראש הכרטיס עם השם והתפקיד */}
        <div className="profile-header">
          <div className="avatar">
            {user.name.charAt(0)}
          </div>
          <h2>{user.name}</h2>
          
        </div>

        {/* תוכן המידע מחולק לקבוצות */}
        <div className="profile-content">
          <section className="info-section">
            <h4>Contact Details</h4>
            <p><strong>@ Email:</strong> {user.email}</p>
            <p><strong>📞 Phone:</strong> {user.phone}</p>
          </section>

          <section className="info-section">
            <h4>Location</h4>
            <p><strong>🏠 Address:</strong> {user.address.street}, {user.address.city}</p>
          </section>

          <section className="info-section">
            <h4>Work</h4>
            <p><strong>🏢 Company:</strong> {user.company.name}</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Info;



// import { useAuth } from "../../../context/AuthContext";
// import "../Info/Info.css";
// const Info = () => {
//   const { user } = useAuth();

//   return (
//     <div className="info-page">
//       <h2>User Information</h2>

//       <p><strong>Name:</strong> {user.name}</p>
//       <p><strong>Username:</strong> {user.username}</p>
//       <p><strong>Email:</strong> {user.email}</p>
//       <p><strong>Phone:</strong> {user.phone}</p>

//       <h3>Address</h3>
//       <p>
//         {user.address.street}, {user.address.city}
//       </p>

//       <h3>Company</h3>
//       <p>{user.company.name}</p>
//     </div>
//   );
// };

// export default Info;
