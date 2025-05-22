import React from "react";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ element }) {
    const isAuthenticated = localStorage.getItem("jwtToken"); 

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return element;
}