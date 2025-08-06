import { useEffect, useState } from "react";
import React from "react";
import {
  FaPlus,
  FaUserCircle,
  FaSearch,
  FaTimes,
  FaSignInAlt,
  FaUser,
  FaSignOutAlt,
  FaBell,
} from "react-icons/fa";
import { PiGameControllerDuotone } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { jwtDecode } from "jwt-decode";
import Modal from "./Modal";

// Barra de navegação do Site

interface JwtDecoded {
  userName: string;
  UserId: string;
  role: string;
}

export function NavBar() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isErrorMsg, setIsErrorMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const decoded = jwtDecode<JwtDecoded>(token);
      setIsLoggedIn(true);
      setUserName(decoded.userName || "John doe");
      console.log("ID:", decoded.UserId);
      console.log("Role:", decoded.role);
    }
  }, []);

  const toggleProfilePanel = () => {
    setIsProfilePanelOpen(!isProfilePanelOpen);
  };

  

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsProfilePanelOpen(false);

    const token = localStorage.getItem("jwtToken");

    if (token) {
      localStorage.removeItem("jwtToken");

      navigate("/?auth=0");
    }
  };

  const handlePublishClick = () => {
    if (isLoggedIn) {
      navigate("/publish");
    }

    //setIsErrorMsg("Para publicar seu achado, faça o login ou crie sua conta!");
    setIsError(true);
    setShowModal(true);
  };

  const handleSearch = () => {
    const query = searchQuery.trim();

    if (query) {
      navigate(`/?query=${encodeURIComponent(query)}`);
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="navbar">
      <div className="logo1">
        <Link to="/" className="logo-link1">
          <span className="logo-game1">Game</span>
          <PiGameControllerDuotone className="logo-icon1" aria-label="Logo GameDeals1" />
          <span className="logo-deals1">Deals</span>
        </Link>
      </div>

      {isError && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="CALMA CALABRESO!"
        >
          <p>
            {isErrorMsg || "Erro interno por favor consulte o administrador."}
          </p>
        </Modal>
      )}

      <div className={`search-bar ${searchFocused ? "focused" : ""}`}>
        <button
          className="search-button"
          onClick={handleSearch}
          aria-label="Pesquisar"
        >
          <FaSearch className="search-icon" />
        </button>
        <input
          type="text"
          placeholder="Buscar ofertas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()} 
        />
        {searchQuery && (
          <button
            className="clear-search"
            onClick={() => {
              setSearchQuery("");
              navigate("/");
            }}
            aria-label="Limpar busca"
          >
            <FaTimes />
          </button>
        )}
      </div>

      <div className="nav-buttons">
        <button
          className="publish-btn"
          aria-label="Publicar oferta"
          onClick={handlePublishClick}
        >
          <FaPlus /> <span className="btn-text">Publicar</span>
        </button>

        
        <div className="profile-container">
          <button
            className="profile-btn"
            aria-label="Perfil"
            onClick={toggleProfilePanel}
          >
            <FaUserCircle />
          </button>

          {isProfilePanelOpen && (
            <div className="profile-panel">
              {isLoggedIn ? (
                <>
                  <div className="profile-header">
                    <span>Olá, {userName}!</span>
                  </div>
                  <Link
                    to="/profile"
                    className="profile-panel-item"
                    onClick={() => setIsProfilePanelOpen(false)}
                  >
                    <FaUser /> Meu Perfil
                  </Link>
                  <button className="profile-panel-item" onClick={handleLogout}>
                    <FaSignOutAlt /> Sair
                  </button>
                </>
              ) : (
                <>
                  <div className="profile-header">
                    <span>Seja bem-vindo!</span>
                  </div>
                  <Link
                    to="/login"
                    className="profile-panel-item"
                    onClick={() => setIsProfilePanelOpen(false)}
                  >
                    <FaSignInAlt /> Login/Registro
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
