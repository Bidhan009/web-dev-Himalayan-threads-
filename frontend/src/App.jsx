// App.jsx
import './App.css';
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load components
const Login = lazy(() => import('./components/public/Login'));
const AdminLogin = lazy(() => import('./components/public/AdminLogin'));
const Home = lazy(() => import('./components/public/Home'));
const Signup = lazy(() => import('./components/public/Signup'));
const PasswordReset = lazy(() => import('./components/public/PasswordReset'));
const Layout = lazy(() => import('./components/public/Layout'));
const ErrorPage = lazy(() => import('./components/public/Error'));
const AdminDashboard = lazy(() => import('./components/private/AdminDashboard'));
const AddProduct = lazy(() => import('./components/private/AddProduct'));
const EditProduct = lazy(() => import('./components/private/EditProduct'));
const UserDashboard = lazy(() => import('./components/private/UserDashboard'));
const UserProfile = lazy(() => import('./components/private/UserProfile'));

// ✅ Protect Admin Routes
const ProtectedAdminRoute = ({ element }) => {
  return localStorage.getItem("adminToken") ? element : <Navigate to="/AdminLogin" />;
};

// ✅ Protect User Routes
const ProtectedUserRoute = ({ element }) => {
  return localStorage.getItem("userToken") ? element : <Navigate to="/Login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
          </Route>

          {/* Public Routes */}
          <Route path="/AdminLogin" element={<ErrorBoundary><AdminLogin /></ErrorBoundary>} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/PasswordReset" element={<PasswordReset />} />

          {/* ✅ Protected Admin Routes */}
          <Route path="/admin-dashboard" element={<ProtectedAdminRoute element={<AdminDashboard />} />} />
          <Route path="/admin/add-product" element={<ProtectedAdminRoute element={<AddProduct />} />} />
          <Route path="/admin/edit-product/:id" element={<ProtectedAdminRoute element={<EditProduct />} />} />

          {/* ✅ Protected User Routes */}
          <Route path="/user-dashboard" element={<ProtectedUserRoute element={<UserDashboard />} />} />
          <Route path="/user/profile" element={<ProtectedUserRoute element={<UserProfile />} />} />

          {/* ✅ Default Route & 404 Page */}
          <Route path="*" element={<Navigate to="/user-dashboard" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
