// src/App.js
import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Home from "./pages/home/Home";
import Root from "./pages/Root";
import Collaborateurs from "./pages/Collaborateurs/Collaborateurs";
import Login from "./pages/login/Login";
import Profil from "./pages/profil/Profil";
import Modele from "./pages/modele/modele";
import Roles from "./pages/roles/Roles";
import NotFound from "./pages/NotFound";


import RoleProtectedRoute from "RoleProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/home",
        element: (
          <RoleProtectedRoute allowedRoles={["Administrateur", "Responsable"]}>
            <Home />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/roles",
        element: (
          <RoleProtectedRoute allowedRoles={["Administrateur"]}>
            <Roles />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/Collaborateurs",
        element: (
          <RoleProtectedRoute allowedRoles={["Responsable", "Administrateur"]}>
            <Collaborateurs />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/profil",
        element: (
          <RoleProtectedRoute allowedRoles={["Collaborateur", "Responsable"]}>
            <Profil />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/modele",
        element: (
          <RoleProtectedRoute allowedRoles={["Responsable", "Administrateur"]}>
            <Modele />
          </RoleProtectedRoute>
        ),
      },
  
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
