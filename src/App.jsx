import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Builder from "./pages/Builder";
import Summary from "./pages/Summary";
import MyBuilds from "./pages/MyBuild";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/footer";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";

function App() {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/builder" element={<Builder />} />
              <Route
                path="/summary"
                element={
                  <ProtectedRoute>
                    <Summary />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-builds"
                element={
                  <ProtectedRoute>
                    <MyBuilds />
                  </ProtectedRoute>
                }
              />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
            <Footer />
          </>
        }
      />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
