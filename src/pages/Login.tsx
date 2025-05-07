import React, { useState } from 'react';
import './Login.css';
import { useNavigate, Link } from 'react-router-dom';
import { PiGameControllerDuotone } from 'react-icons/pi';

export function Login() {
    // Estados para login
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Estados para recuperação
    const [isRecovering, setIsRecovering] = useState(false);
    const [recoveryEmail, setRecoveryEmail] = useState('');

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            if (email && password) {
                setMessage('Login bem-sucedido! (Simulação)');
            } else {
                setMessage('Preencha todos os campos!');
            }
            setIsLoading(false);
        }, 1500);
    };

    const handleRecoverySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            if (recoveryEmail) {
                setMessage(`Link enviado para ${recoveryEmail} (Simulação)`);
            } else {
                setMessage('Digite seu e-mail!');
            }
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="login-page-container">
            {/* Container preto à esquerda com saudação e logo */}
            <div className="welcome-container">
                <div className="logo">
                    <Link to="/home" className="logo-link">
                        <PiGameControllerDuotone className="logo-icon" aria-label="Logo GameDeals" />
                        <span className="gradient-logo">GameDeals</span>
                    </Link>
                </div>
                <h2 className="welcome-text">BEM VINDO!</h2>
                <p className="welcome-subtext">Entre para o seu novo universo, descubra as melhores promoções gamer e economize mais!</p>
            </div>

            {/* Container de login à direita */}
            <div className="login-container">
                <div className="login-card">
                    {isRecovering ? (
                        /* MODO RECUPERAÇÃO */
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
                        /* MODO LOGIN NORMAL */
                        <>
                            <div className="login-header">
                                <h2 className="login-title">
                                    <span className="gradient-text">LOGIN</span>
                                </h2>
                            </div>

                            <form onSubmit={handleLoginSubmit} className="login-form">
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
                                    {isLoading ? 'CARREGANDO...' : 'ENTRAR'}
                                </button>

                                {message && (
                                    <p className={`login-message ${message.includes('bem-sucedido') ? 'success' : 'error'}`}>
                                        {message}
                                    </p>
                                )}
                            </form>

                            <div className="login-footer">
                                <a
                                    href="/register"
                                    className="login-link"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/register');
                                    }}
                                >
                                    Criar conta
                                </a>
                                <a
                                    href="#"
                                    className="login-link"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsRecovering(true);
                                        setMessage('');
                                    }}
                                >
                                    Esqueci a senha
                                </a>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}