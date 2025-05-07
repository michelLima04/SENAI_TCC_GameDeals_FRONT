import React from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Publish } from "../pages/Publish";
import { Profile } from "../pages/Profile";

export function AppRoutes(){
    return(
      <Routes>
         <Route path= '/home' element={<Home />} />
         <Route path= '/login' element={<Login />} />
         <Route path= '/register' element={<Register />} />
         <Route path= '/profile' element={<Profile />} />
         <Route path= '/publish' element={<Publish />} />
      </Routes>
    );
}