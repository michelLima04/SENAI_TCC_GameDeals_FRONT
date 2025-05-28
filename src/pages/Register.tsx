import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Arquivo CSS específico
import api from '../services/api';

export function Register() {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (fullName && username && email && password) {
            setIsLoading(true);
            try {
                const response = await api.post('/Usuarios/Registro', {
                    nomeSobrenome: fullName,
                    usuarioNome: username,
                    email: email,
                    senha: password,
                });

                setMessage('Registro realizado com sucesso!');
                setTimeout(() => navigate('/login'), 1500)
            } catch (error) {
                setMessage(error.response.data.mensagem ?? 'Erro ao registrar usuário. Tente novamente.');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        } else {
            setMessage('Preencha todos os campos!');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2 className="login-title">
                        <span className="gradient-text">CRIE SUA CONTA</span>
                    </h2>
                    <p className="login-subtitle">Junte-se ao nosso universo</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                {message && (
                        <p className={`login-message ${message.includes('sucesso') ? 'success' : 'error'}`}>
                            {message}
                        </p>
                    )}
                    <div className="input-group">
                        <label htmlFor="fullName">Nome Completo</label>
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Seu nome completo"
                            className="login-input"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="username">Nome de Usuário</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Escolha um nome de usuário"
                            className="login-input"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            className="login-input"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Senha</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="login-input"
                            />
                            <div className="show-password-toggle">
                                <input
                                    type="checkbox"
                                    id="showPassword"
                                    checked={showPassword}
                                    onChange={() => setShowPassword(!showPassword)}
                                />
                                <label htmlFor="showPassword" className="toggle-label">
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </label>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'CADASTRANDO...' : 'REGISTRAR'}
                    </button>

                 
                </form>

                <div className="register-footer">
                    <span className="register-text">Já tem uma conta?</span>
                    <button
                        className="register-link"
                        onClick={() => navigate('/login')}
                    >
                        Faça login
                    </button>
                </div>
            </div>
        </div>
    );
}