import React from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Publish } from "../pages/Publish";
import { Profile } from "../pages/Profile";
import { ProtectedRoute } from "../components/Protect";
import { ImageRef } from "../pages/ImageRef";

export function AppRoutes(){
    return(
      <Routes>
         <Route path= '/' element={<Home />} />
         <Route path= '/login' element={<Login />} />
         <Route path= '/register' element={<Register />} />
         <Route path= '/profile' element={<ProtectedRoute element={<Profile />} />} />
         <Route path= '/publish' element={<ProtectedRoute element={<Publish />} />} />
         <Route path="/images/image-not-found" element={<ImageRef />} />
      </Routes>
    );
}