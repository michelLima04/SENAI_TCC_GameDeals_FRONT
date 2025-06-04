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

interface JwtDecoded {
  userName: string;
  UserId: string;
  role: string;
}

export function NavBar() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false);
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] =
    useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [notifications, setNotifications] = useState([]);
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
    setIsNotificationsPanelOpen(false);
  };

  const toggleNotificationsPanel = () => {
    setIsNotificationsPanelOpen(!isNotificationsPanelOpen);
    setIsProfilePanelOpen(false);
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

    setIsErrorMsg("Para publicar seu achado, faça o login ou crie sua conta!");
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
      <div className="logo">
        <Link to="/" className="logo-link">
          <span className="gradient-logo">Game</span>
          <PiGameControllerDuotone
            className="logo-icon"
            aria-label="Logo GameDeals"
          />
          <span className="gradient-logo">Deals</span>
        </Link>
      </div>


      {isError && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Calma calabreso!"
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
          onKeyPress={(e) => e.key === "Enter" && handleSearch()} // Permite busca ao pressionar Enter
        />
        {searchQuery && (
          <button
            className="clear-search"
            onClick={() => setSearchQuery("")}
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

        <div className="notifications-container">
          <button
            className="notifications-btn"
            aria-label="Notificações"
            onClick={toggleNotificationsPanel}
          >
            <FaBell />
          </button>

          {isNotificationsPanelOpen && (
            <div className="notifications-panel">
              <div className="notifications-header">
                <span>Notificações</span>
              </div>

              {notifications.length > 0 ? (
                <div className="notifications-list">
                  {/* Aqui você renderizaria as notificações */}
                  {/* {notifications.map(notification => (...))} */}
                </div>
              ) : (
                <div className="no-notifications">Nada por enquanto...</div>
              )}
            </div>
          )}
        </div>

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
