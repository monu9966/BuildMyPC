import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"
import Home from "./pages/Home";
import Builder from "./pages/Builder";
import Summary from "./pages/Summary";
import MyBuilds from "./pages/MyBuild";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/footer";
import Admin from "./pages/Admin";


function App() {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/summary" element={<ProtectedRoute><Summary /></ProtectedRoute>} />
        <Route path="/my-builds" element={<ProtectedRoute><MyBuilds /></ProtectedRoute>} />
        <Route path="/admin" element={<Admin />} />

      </Routes>
      <Footer />
    </>
  );
}

export default App;


