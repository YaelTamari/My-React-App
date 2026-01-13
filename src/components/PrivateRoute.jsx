import { useAuth } from "../context/AuthContext";
import { Navigate , Outlet, useParams} from "react-router-dom";

function PrivateRoute() {
  const { user, logout, isCheckingUser } = useAuth();
  const { userId } = useParams();

//   return user ? children : <Navigate to="/" />;

if (isCheckingUser) {
    return <div>Loading...</div>;
  }

if (!user) {
    return <Navigate to="/" replace />;
  }
  if ( String(user.id) !== userId) {
    logout();
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export default PrivateRoute;