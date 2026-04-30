import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Plans from "./pages/Plans";
import Classes from "./pages/Classes";
import Market from "./pages/Market";
import Feedback from "./pages/Feedback";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPlans from "./pages/admin/AdminPlans";
import AdminMembers from "./pages/admin/AdminMembers";
import AdminClasses from "./pages/admin/AdminClasses";
import AdminEquipment from "./pages/admin/AdminEquipment";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminFeedback from "./pages/admin/AdminFeedback";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/market" element={<Market />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Member protected routes */}
          <Route element={<ProtectedRoute allowedRoles={["member", "admin"]} />}>
            <Route path="/account" element={<Account />} />
          </Route>

          {/* Admin protected routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/plans" element={<AdminPlans />} />
            <Route path="/admin/members" element={<AdminMembers />} />
            <Route path="/admin/classes" element={<AdminClasses />} />
            <Route path="/admin/equipment" element={<AdminEquipment />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/feedback" element={<AdminFeedback />} />
          </Route>

          {/* 404 fallback */}
          <Route path="*" element={<h2 style={{ padding: "2rem" }}>404 — Page not found</h2>} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;