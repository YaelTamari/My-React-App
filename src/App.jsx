import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Authentication from "./components/Authentication/Authentication";
import Login from "./components/Authentication/Login/Login";
import Register from "./components/Authentication/Register/Register"
import RegisterDetails from "./components/Authentication/Register/RegisterDetails";
import Home from "./components/Home/Home";
import Info from "./components/Home/Info/Info";
import Todos from "./components/Home/Todos/Todos";
import Posts from "./components/Home/Posts/Posts";
import Albums from "./components/Home/Albums/Albums";
import Photos from "./components/Home/Albums/Photos/Photos"



function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* נתיבים פתוחים */}
      <Route
        path="/"
        element={user ? <Navigate to={`/users/${user.id}/home`} replace /> : <Authentication />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/details" element={<RegisterDetails />} />

      {/* נתיבים מוגנים הכוללים userId */}
      <Route
        path="/users/:userId/home"
        element={user ? <Home /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/users/:userId/info"
        element={user ? <Info /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/users/:userId/todos"
        element={user ? <Todos /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/users/:userId/todos/:todoId"
        element={user ? <Todos /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/users/:userId/posts"
        element={user ? <Posts /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/users/:userId/posts/:postId"
        element={user ? <Posts /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/users/:userId/albums"
        element={user ? <Albums /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/users/:userId/albums/:albumId/photos"
        element={user ? <Photos /> : <Navigate to="/login" replace />}
      />

      {/* טיפול בכתובת לא ידועה */}
      <Route
        path="*"
        element={user ? <Navigate to={`/users/${user.id}/home`} replace /> : <Navigate to="/" replace />}
      />
    </Routes>
    // <Routes>
    //   {/* פתוחים */}
    //   <Route
    //     path="/"
    //     element={user ? <Navigate to="/home" replace /> : <Authentication />}
    //   />

    //   <Route path="/login" element={<Login />} />
    //   <Route path="/register" element={<Register />} />
    //   <Route path="/register/details" element={<RegisterDetails />} />

    //   {/* מוגנים (ידנית) */}
    //   <Route
    //     path="/home"
    //     element={user ? <Home /> : <Navigate to="/" replace />}
    //   />

    //   <Route
    //     path="/info"
    //     element={user ? <Info /> : <Navigate to="/" replace />}
    //   />

    //   <Route
    //     path="/todos"
    //     element={user ? <Todos /> : <Navigate to="/" replace />}
    //   />

    //   <Route
    //     path="/posts"
    //     element={user ? <Posts /> : <Navigate to="/" replace />}
    //   />

    //   <Route
    //     path="/albums"
    //     element={user ? <Albums /> : <Navigate to="/" replace />}
    //   />

    //   {/* כל כתובת אחרת */}
    //   <Route
    //     path="*"
    //     element={user ? <Navigate to="/home" replace /> : <Navigate to="/" replace />}
    //   />

    //   <Route path="/albums/:albumId/photos" element={<Photos />} />
    //   <Route path="/posts/:postId" element={<Posts />} />
    //   <Route path="/todos/:todoId" element={<Todos />} />
    // </Routes>
  );
}


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;