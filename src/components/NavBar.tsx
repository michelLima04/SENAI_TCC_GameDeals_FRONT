import { useState } from 'react';
import React from 'react';
import { FaPlus, FaUserCircle, FaSearch, FaTimes, FaSignInAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { PiGameControllerDuotone } from "react-icons/pi";
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export function NavBar() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('JohnDoe');
  const navigate = useNavigate();

  const toggleProfilePanel = () => {
    setIsProfilePanelOpen(!isProfilePanelOpen);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsProfilePanelOpen(false);
    // Adicione aqui a lógica de logout real
  };

  const handlePublishClick = () => {
    navigate('/publish');
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/home" className="logo-link">
          <PiGameControllerDuotone className="logo-icon" aria-label="Logo GameDeals" />
          <span className="gradient-logo">GameDeals</span>
        </Link>
      </div>

      <div className={`search-bar ${searchFocused ? 'focused' : ''}`}>
        <FaSearch className="search-icon" />
        <input 
          type="text" 
          placeholder="Buscar ofertas..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        {searchQuery && (
          <button 
            className="clear-search" 
            onClick={() => setSearchQuery('')}
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
                    <FaUserCircle className="profile-panel-icon" />
                    <span>Olá, {userName}!</span>
                  </div>
                  <Link to="/profile" className="profile-panel-item" onClick={() => setIsProfilePanelOpen(false)}>
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
                  <Link to="/login" className="profile-panel-item" onClick={() => setIsProfilePanelOpen(false)}>
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