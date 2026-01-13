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

import Layout from "./components/NavBar/Layout";
import PrivateRoute from "./components/PrivateRoute";


function AppRoutes() {
  const {isCheckingUser } = useAuth();

  if (isCheckingUser) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Authentication />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/details" element={<RegisterDetails />} />

      <Route path="/users/:userId" element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="home" element={<Home />} />
          <Route path="info" element={<Info />} />
          <Route path="todos" element={<Todos />} />
          <Route path="todos/:todoId" element={<Todos />} />
          <Route path="posts" element={<Posts />} />
          <Route path="posts/:postId" element={<Posts />} />
          <Route path="albums" element={<Albums />} />
          <Route path="albums/:albumId/photos" element={<Photos />} />

          <Route path="*" element={<Navigate to="home" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
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

