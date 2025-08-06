import React, { useState, useEffect } from "react";
import "./CommentModal.css";
import api from "../services/api";

import {
  FaEdit,
  FaTrash,
  FaCommentDots,
  FaHeart,
  FaRegHeart,
 FaCopy 
} from "react-icons/fa";

export type Comentario = {
  id: number;
  comentarioTexto: string;
  dataComentario: string;
  isDono: boolean;
  usuarioNome: string;
};

export type PromoDetalhada = {
  id: number;
  titulo: string;
  preco: number;
  imagemUrl: string;
  site: string;
  usuarioNome: string;
  cupom: string;
  comentarios: Comentario[];
  url: string;
  isLiked: boolean;
  likes: number;
};

type Props = {
  promo: PromoDetalhada;
  onClose: () => void;
  handleLikeClick: (id: number) => void;
};

export function CommentModal({ promo, onClose, handleLikeClick }: Props) {
  const [newComment, setNewComment] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [promoData, setPromoData] = useState<PromoDetalhada | null>(null);
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const token = localStorage.getItem("jwtToken");

  const fetchPromoDetails = async () => {
    try {
      const response = await api.get(`/Promocao/Feed/${promo.id}`);
      setPromoData(response.data);
    } catch (error) {
      console.error("Erro ao buscar detalhes da promoção:", error);
    }
  };

  useEffect(() => {
    if (promo?.id) fetchPromoDetails();
  }, [promo]);

  const handleSubmit = async () => {
    if (!newComment.trim() || !token) return;
    try {
      await api.post(
        "/Comentario/Cadastrar",
        {
          comentarioTexto: newComment,
          idPromocao: promo.id,
          usuarioNome: promo.usuarioNome,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      fetchPromoDetails();
    } catch (error) {
      console.error("Erro ao comentar:", error);
    }
  };



  const handleDelete = async (id: number) => {
    if (!token || !window.confirm("Deseja realmente excluir o comentário?"))
      return;
    try {
      await api.delete(`/Comentario/Deletar/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPromoDetails();
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  const handleEdit = async () => {
    if (!token || !editCommentText.trim()) return;
    try {
      await api.put(
        "/Comentario/Alterar",
        { id: editCommentId, comentarioTexto: editCommentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditCommentId(null);
      setEditCommentText("");
      fetchPromoDetails();
    } catch (error) {
      console.error("Erro ao editar comentário:", error);
    }
  };

  const toggleLike = async () => {
      if (!token) return;

      try {
        const response = await api.post(`/Promocao/Feed/${promo.id}/like`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { quantidadeCurtidas, jaCurtido } = response.data;

        setPromoData(prev => prev ? {
          ...prev,
          likes: quantidadeCurtidas,
          isLiked: jaCurtido
        } : prev);
      } catch (error) {
        console.error("Erro ao curtir/descurtir:", error);
      }
  };


  if (!promoData) return null;

  const comments = promoData.comentarios || [];
  const visibleComments = showAll ? comments : comments.slice(0, 3);
  function handleCopy(cupom) {
    const texto = cupom ? cupom : "Sem cupom";
    navigator.clipboard.writeText(texto);
    alert("Cupom copiado!");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-bar">
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-header">
          <div className="promo-user-link">
            <img src={promoData.imagemUrl} alt={promoData.titulo} />
          </div>

          <div className="modal-info">
            <p className="promo-user">@{promoData.usuarioNome}</p>

            <h2 className="promo-title">{promoData.titulo}</h2>
            <div className="price-row" style={{ display: "flex", alignItems: "center" }}>
              
              <span
                className="promo-likes"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike();
                }}
                style={{ marginLeft: "auto", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", color: "#ff6a00" }}
              >
                {promoData.isLiked ? (
                  <FaHeart className="meta-icon liked" />
                ) : (
                  <FaRegHeart className="meta-icon" />
                )}
                <span className="like-count">{promoData.likes}</span>
              </span>


              <p className="promo-price" style={{ margin: 0 }}>
                R$ {promoData.preco.toFixed(2).replace('.', ',')}
              </p>
              <span className="cupom-border">
                  {promoData.cupom ? promoData.cupom : "Sem cupom"}
                  {promoData.cupom && (
                    <button className="copy-btn" onClick={() => handleCopy(promoData.cupom)}>
                      <FaCopy />
                    </button>
                  )}
                </span>
            </div>
            <a
              className="promo-link"
              href={promoData.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Conferir ➤
            </a>
          </div>
        </div>

        <div className="modal-comments">
          <h3>Comentários</h3>
          {visibleComments.length === 0 && (
            <p className="no-comments">Nenhum comentário ainda.</p>
          )}

          {visibleComments.map((comment) => (
            <div key={comment.id} className="comment-item">
              {editCommentId === comment.id ? (
                <>
                  <textarea
                    className="edit-textarea"
                    value={editCommentText}
                    onChange={(e) => setEditCommentText(e.target.value)}
                    rows={2}
                  />
                  <div className="edit-buttons">
                    <button className="btn-save" onClick={handleEdit}>
                      Salvar
                    </button>
                    <button
                      className="btn-cancel"
                      onClick={() => setEditCommentId(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p>
                    <FaCommentDots className="comment-icon" />
                    {comment.comentarioTexto}
                  </p>
                  <small>
                    por <strong>@{comment.usuarioNome}</strong>
                  </small>
                  {token && (
                    <div className="comment-actions">
                      <button
                        onClick={() => {
                          setEditCommentId(comment.id);
                          setEditCommentText(comment.comentarioTexto);
                        }}
                        className="icon-button edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="icon-button delete"
                        onClick={() => handleDelete(comment.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          {comments.length > 3 && (
            <button
              className="show-more-btn"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Ver menos" : "Ver mais comentários"}
            </button>
          )}
        </div>

        {token && (
          <div className="modal-comment-input">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva seu comentário..."
              rows={2}
            />
            <button className="btn-comment" onClick={handleSubmit}>
              <FaCommentDots /> Comentar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
