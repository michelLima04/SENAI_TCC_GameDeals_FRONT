import React, { useEffect, useState } from 'react';
import './Login.css';
import { useNavigate, Link } from 'react-router-dom';
import { PiGameControllerDuotone } from 'react-icons/pi';
import api from '../services/api';

interface LoginResponse {
    mensagem: string;
    token: string;
}

export function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isRecovering, setIsRecovering] = useState(false);
    const [recoveryEmail, setRecoveryEmail] = useState('');

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");

        if (token) {
            navigate('/?auth=1');
        }
    }, [])

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
    
        try {
            const response = await api.post<LoginResponse>('/Usuarios/Login', {
                email: email,
                senha: password
            });
    
            if (response.data.token) {
                localStorage.setItem('jwtToken', response.data.token);
                setMessage('Login bem-sucedido!'); 
                setTimeout(() => navigate('/'), 1500);
            }
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Erro ao fazer login');
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    };

    const handleRecoverySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            if (recoveryEmail) {
                setMessage(`Link de recuperação enviado para ${recoveryEmail}`);
            } else {
                setMessage('Digite seu e-mail!');
            }
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="login-page-container">
            <div className="welcome-container">
                <div className="logo">
                    <Link to="/" className="logo-link">
                        <PiGameControllerDuotone className="logo-icon" aria-label="Logo GameDeals" />
                        <span className="gradient-logo">GameDeals</span>
                    </Link>
                </div>
            </div>

            <div className="login-container">
                <div className="login-card">
                    {isRecovering ? (
                        <>
                            <div className="login-header">
                                <h2 className="login-title">
                                    <span className="gradient-text">RECUPERAR SENHA</span>
                                </h2>
                                <p className="login-subtitle">Digite seu e-mail cadastrado</p>
                            </div>

                            <form onSubmit={handleRecoverySubmit} className="login-form">
                                <div className="input-group">
                                    <label htmlFor="recovery-email">E-mail</label>
                                    <input
                                        type="email"
                                        id="recovery-email"
                                        value={recoveryEmail}
                                        onChange={(e) => setRecoveryEmail(e.target.value)}
                                        placeholder="seu@email.com"
                                        className="login-input"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="login-button"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'ENVIANDO...' : 'ENVIAR LINK'}
                                </button>

                                <button
                                    type="button"
                                    className="login-button secondary"
                                    onClick={() => {
                                        setIsRecovering(false);
                                        setMessage('');
                                    }}
                                >
                                    VOLTAR
                                </button>

                                {message && (
                                    <p className={`login-message ${message.includes('enviado') ? 'success' : 'error'}`}>
                                        {message}
                                    </p>
                                )}
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="login-header">
                                <h2 className="login-title">
                                    <span className="gradient-text">BEM VINDO!</span>
                                </h2>
                            </div>

                            <form onSubmit={handleLoginSubmit} className="login-form">
                                {message && (
                                    <p className={`login-message ${message.includes('bem-sucedido') || message === 'Login bem-sucedido!' ? 'success' : 'error'}`}>
                                        {message}
                                    </p>
                                )}

                                <div className="input-group">
                                    <label htmlFor="email">E-mail</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="seu@email.com"
                                        className="login-input"
                                        required
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
                                            required
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
                                    {isLoading ? 'CARREGANDO...' : 'ENTRAR'}
                                </button>
                            </form>

                            <div className="login-footer">
                                <Link to="/register" className="login-link">
                                    Criar conta
                                </Link>
                                <button
                                    className="login-link"
                                    onClick={() => {
                                        setIsRecovering(true);
                                        setMessage('');
                                    }}
                                >
                                    Esqueci a senha
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}