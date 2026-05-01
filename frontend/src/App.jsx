import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

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

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public + member routes — with Navbar/Footer */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/plans" element={<PublicLayout><Plans /></PublicLayout>} />
          <Route path="/classes" element={<PublicLayout><Classes /></PublicLayout>} />
          <Route path="/market" element={<PublicLayout><Market /></PublicLayout>} />
          <Route path="/feedback" element={<PublicLayout><Feedback /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
          <Route path="/signup" element={<PublicLayout><Signup /></PublicLayout>} />

          <Route element={<ProtectedRoute allowedRoles={["member", "admin"]} />}>
            <Route path="/account" element={<PublicLayout><Account /></PublicLayout>} />
          </Route>

          {/* Admin routes — with sidebar, NO Navbar/Footer */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/*" element={
              <AdminLayout>
                <Routes>
                  <Route index        element={<AdminDashboard />} />
                  <Route path="plans"     element={<AdminPlans />} />
                  <Route path="members"   element={<AdminMembers />} />
                  <Route path="classes"   element={<AdminClasses />} />
                  <Route path="equipment" element={<AdminEquipment />} />
                  <Route path="products"  element={<AdminProducts />} />
                  <Route path="feedback"  element={<AdminFeedback />} />
                </Routes>
              </AdminLayout>
            } />
          </Route>

          <Route path="*" element={<PublicLayout><h2 style={{padding:"3rem",color:"#fff"}}>404 — Page not found</h2></PublicLayout>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;