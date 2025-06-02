import React, { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import Footer from "../components/Footer";
import { BsFillCalendarFill } from "react-icons/bs";
import { FaTrophy, FaUserEdit, FaKey } from "react-icons/fa";
import axios from "../services/api";
import "./Profile.css";

export const Profile: React.FC = () => {
  const [userData, setUserData] = useState<{
    username: string;
    fullName: string;
    joinDate: string;
    contributions: number;
  } | null>(null);

  const [logs, setLogs] = useState<
    {
      acao: string;
      entidadeAfetada: string;
      idEntidade: number;
      detalhes: string;
      createdAt: string;
    }[]
  >([]);

  const [showAllLogs, setShowAllLogs] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    username: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({ atual: "", nova: "" });

  const fetchUserData = async () => {
    try {
      const res = await axios.get("/Usuarios/Profile/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setUserData(res.data);
      setLogs(res.data.logs || []);
      setFormData({
        nome: res.data.fullName,
        username: res.data.username.replace("@", ""),
        email: res.data.email || "",
      });
    } catch {
      alert("Erro ao carregar dados do perfil");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const handleEditProfile = async () => {
    try {
      await axios.put(
        "/Usuarios/Profile/editar",
        {
          nomeSobrenome: formData.nome,
          usuarioNome: formData.username,
          email: formData.email,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      setShowEditModal(false);
      fetchUserData();
    } catch {
      alert("Erro ao editar perfil");
    }
  };

  const handleChangePassword = async () => {
    try {
      await axios.put(
        "/Usuarios/Profile/trocar-senha",
        {
          senhaAtual: passwordData.atual,
          novaSenha: passwordData.nova,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      setShowPasswordModal(false);
      setPasswordData({ atual: "", nova: "" });
      alert("Senha alterada com sucesso");
    } catch {
      alert("Erro ao alterar senha");
    }
  };

  const visibleLogs = showAllLogs ? logs : logs.slice(0, 5);

  if (!userData) {
    return (
      <div className="profile-page">
        <NavBar />
        <main className="profile-container">
          <p>Carregando...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <NavBar />
      <main className="profile-container">
        <section className="card profile-card">
          <header className="profile-header">
            <div className="avatar-circle">
              <span>{getInitials(userData.fullName)}</span>
            </div>
            <div className="profile-main-info">
              <h1>{userData.fullName}</h1>
              <p>{userData.username}</p>
              <div className="action-buttons">
                <button
                  className="btn edit"
                  onClick={() => setShowEditModal(true)}
                >
                  <FaUserEdit /> Editar Perfil
                </button>
                <button
                  className="btn password"
                  onClick={() => setShowPasswordModal(true)}
                >
                  <FaKey /> Trocar Senha
                </button>
              </div>
            </div>
          </header>
          {showEditModal && (
            <div
              className="modal-overlay"
              onClick={() => setShowEditModal(false)}
            >
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Editar Perfil</h3>
                <input
                  className="modal-input"
                  type="text"
                  placeholder="Nome completo"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                />
                <input
                  className="modal-input"
                  type="text"
                  placeholder="Usuário"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  disabled
                />
                <input
                  className="modal-input"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled
                />
                <div className="modal-actions">
                  <button
                    className="btn cancel"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancelar
                  </button>
                  <button className="btn confirm" onClick={handleEditProfile}>
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}

          {showPasswordModal && (
            <div
              className="modal-overlay"
              onClick={() => setShowPasswordModal(false)}
            >
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Trocar Senha</h3>
                <input
                  className="modal-input"
                  type="password"
                  placeholder="Senha atual"
                  value={passwordData.atual}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, atual: e.target.value })
                  }
                />
                <input
                  className="modal-input"
                  type="password"
                  placeholder="Nova senha"
                  value={passwordData.nova}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, nova: e.target.value })
                  }
                />
                <div className="modal-actions">
                  <button
                    className="btn cancel"
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn confirm"
                    onClick={handleChangePassword}
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <BsFillCalendarFill size={24} className="stat-icon red" />
              </div>
              <div>
                <h3>Membro desde</h3>
                <p>{userData.joinDate}</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <FaTrophy size={24} className="stat-icon gold" />
              </div>
              <div>
                <h3>Contribuições</h3>
                <p>{userData.contributions}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="card activities-card">
          <h2>Atividades Recentes ({logs.length})</h2>
          {logs.length === 0 ? (
            <p className="muted">Nenhuma atividade registrada.</p>
          ) : (
            <>
              <ul className="activity-list">
                {visibleLogs.map((log, index) => (
                  <li key={index} className="activity-item">
                    <div className="activity-details">
                      <strong>{log.acao}</strong> em{" "}
                      <em>{log.entidadeAfetada}</em> (ID: {log.idEntidade})
                      <br />
                      <span className="log-detail">{log.detalhes}</span>
                    </div>
                    <div className="activity-time">{log.createdAt}</div>
                  </li>
                ))}
              </ul>
              {logs.length > 5 && (
                <button
                  className="btn view-more"
                  onClick={() => setShowAllLogs(!showAllLogs)}
                >
                  {showAllLogs ? "Ver menos" : "Ver mais"}
                </button>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};
