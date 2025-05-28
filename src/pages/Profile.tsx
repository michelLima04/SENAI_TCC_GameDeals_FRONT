import React from 'react';
import { NavBar } from '../components/Navbar';
import Footer from '../components/Footer';
import { FaUserCircle, FaGamepad, FaTrophy, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { BsFillCalendarFill, BsHeadset } from 'react-icons/bs';
import './Profile.css';

export const Profile: React.FC = () => {
    // Dados do usuário (simulados)
    const userData = {
        username: '@limamichel04',
        fullName: 'Michel Lima',
        email: 'limamichel04@example.com',
        joinDate: '15/03/2023',
        avatar: 'https://i.pravatar.cc/150?img=3' // Imagem de exemplo
    };

    return (
        <div className="profile-page">
            <NavBar />
            <main className="profile-avatar-container">
                <div className="profile-avatar-header">
                    <div className="profile-page-avatar">
                        <img src={userData.avatar} alt="Avatar" />
                    </div>
                    <div className="profile-info">
                        <h1>{userData.fullName}</h1>
                        <h2>{userData.username}</h2>
                    </div>
                    <div className="profile-actions">
                    <button className="action-btn edit-profile">
                        <FaCog /> Editar Perfil
                    </button>
                </div>
                </div>

                <div className="profile-details">
                    <div className="detail-card">
                        <h3><BsFillCalendarFill /> Membro desde</h3>
                        <p>{userData.joinDate}</p>
                    </div>
                    <div className="detail-card">
                        <h3>📧 Email</h3>
                        <p>{userData.email}</p>
                    </div>
                </div>

                <div className="recent-activity">
                    <h2>Atividades Recente</h2>
                </div>
            </main>
            <Footer />
        </div>
    );
};