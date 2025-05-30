import React from 'react';
import { NavBar } from '../components/Navbar';
import Footer from '../components/Footer';
import { FaUserCircle, FaGamepad, FaTrophy, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { BsFillCalendarFill, BsHeadset } from 'react-icons/bs';
import './Profile.css';

export const Profile: React.FC = () => {
    const userData = {
        username: '@limamichel04',
        fullName: 'User teste',
        contributions: 10,
        joinDate: '15/03/2023'
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(part => part[0]).join('').toUpperCase();
    };

    return (
        <div className="profile-page">
            <NavBar />
            <main className="profile-avatar-container">
                <div className="profile-avatar-header">
                    <div className="profile-page-avatar">
                        <div className="avatar-initials">
                            {getInitials(userData.fullName)}
                        </div>
                    </div>

                    <div className="profile-info">
                        <h1>{userData.fullName}</h1>
                        <h2>{userData.username}</h2>
                    </div>
                    <div className="profile-actions">   
                    </div>
                </div>

                <div className="profile-details">
                    <div className="detail-card">
                        <div className="detail-icon calendar">
                            <BsFillCalendarFill size={24} />
                        </div>
                        <div className="detail-content">
                            <h3>Membro desde</h3>
                            <p>{userData.joinDate}</p>
                        </div>
                    </div>
                    <div className="detail-card">
                        <div className="detail-icon trophy">
                            <FaTrophy size={24} />
                        </div>
                        <div className="detail-content">
                            <h3>Contribuições</h3>
                            <p>{userData.contributions}</p>
                        </div>
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