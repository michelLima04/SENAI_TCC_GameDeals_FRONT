import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Arquivo CSS específico

export function Register() {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulação de cadastro
        setTimeout(() => {
            if (fullName && username && email && password) {
                setMessage('Cadastro bem-sucedido! Redirecionando...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setMessage('Preencha todos os campos!');
            }
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2 className="login-title">
                        <span className="gradient-text">CRIAR CONTA</span>
                    </h2>
                    <p className="login-subtitle">Junte-se ao nosso universo</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
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
                        {isLoading ? 'CADASTRANDO...' : 'CRIAR CONTA'}
                    </button>

                    {message && (
                        <p className={`login-message ${message.includes('bem-sucedido') ? 'success' : 'error'}`}>
                            {message}
                        </p>
                    )}
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