import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";

import Home from "./pages/Home";
import Builder from "./pages/Builder";
import Summary from "./pages/Summary";
import MyBuilds from "./pages/MyBuild";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Admin from "./pages/Admin";
import OrdersAdmin from "./components/admin/OrdersAdmin";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";

function App() {
  return (
    <div className="app-layout">
      
      {/* USER WEBSITE */}
      <Routes>
        <Route
          path="/*"
          element={
            <>
              <Navbar />

              <main className="main-content">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/builder" element={<Builder />} />
                  <Route path="/summary" element={<Summary />} />

                  {/* Protected Routes */}
                  <Route
                    path="/my-builds"
                    element={
                      <ProtectedRoute>
                        <MyBuilds />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <MyOrders />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>

              <Footer />
            </>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <OrdersAdmin />
            </AdminRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;