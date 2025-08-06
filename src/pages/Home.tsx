import React, { useEffect, useState } from "react";
import "./Home.css";
import { NavBar } from "../components/NavBar";
import { CardCustom } from "../components/CardCustom";
import api from "../services/api";
import Modal from "../components/Modal";
import { CommentModal, Comentario } from "../components/CommentModal";
import { useLocation, useNavigate } from "react-router-dom";

// Página Home do Site

type Post = {
  id: number;
  titulo: string;
  preco: number;
  cupom: string;
  imagemUrl: string;
  site: string;
  tempoPostado: string;
  usuarioNome: string;
  quantidadeComentarios: number;
  quantidadeCurtidas: number;
  isLiked: boolean;
  createdAt: string;
  url: string;
  comentarios: Comentario[];
  likes: number;
};

type UpdatedPostResponse = {
  id: number;
  quantidadeCurtidas: number;
  jaCurtido: boolean;
};

export function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isErrorMsg, setIsErrorMsg] = useState("");
  const [selectedPromo, setSelectedPromo] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userLogged, setUserLogged] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [promoToDelete, setPromoToDelete] = useState<number | null>(null);

  const useQueryParam = (key: string) => {
    return new URLSearchParams(location.search).get(key);
  };

  function formatPostedAgo(dateString: string): string {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffMs = now.getTime() - postDate.getTime();

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;

    const pluralize = (value: number, singular: string, plural: string) =>
      `${value} ${value === 1 ? singular : plural}`;

    if (days > 0) {
      if (hours > 0) {
        return `há ${pluralize(days, "d", "d")} e ${pluralize(
          hours,
          "h",
          "h"
        )}`;
      }
      return `há ${pluralize(days, "d", "d")}`;
    }

    if (totalHours > 0) {
      if (minutes > 0) {
        return `há ${pluralize(totalHours, "h", "h")} e ${pluralize(
          minutes,
          "min",
          "min"
        )}`;
      }
      return `há ${pluralize(totalHours, "h", "h")}`;
    }

    return `há ${pluralize(minutes, "min", "min")}`;
  }

  const userProfile = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setUserLogged("");
        return; 
      }

      const uri = `/Usuarios/Profile/me`;
      const response = await api.get(uri, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setUserLogged(response.data.username);
      }
    } catch (error) {
      console.error("Erro ao curtir promoção: ", error);
    }
  };

  const fetchFeed = async (titulo?: string | null) => {
    setIsLoading(true);
    try {
      const response = await api.get<Post[]>("/Promocao/Feed", {
        params: titulo ? { titulo } : {},
      });
      setPosts(response.data);
    } catch (error) {
      console.error("Erro ao buscar feed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSearchResults = async (nomeProduto: string) => {
    setIsLoading(true);
    try {
      const response = await api.get<Post[]>("/Promocao/Buscar", {
        params: { nomeProduto },
      });
      setPosts(response.data);
    } catch (error) {
      console.error("Erro ao buscar promoções:", error);
      setPosts([]); // limpa resultados em erro
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeObj = async (id: number) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setIsErrorMsg("Para curtir logue ou crie sua conta!");
        setIsError(true);
        setShowModal(true);
        return;
      }

      const uri = `/Promocao/Feed/${id}/like`;
      const response = await api.post<UpdatedPostResponse>(
        uri,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedPost = response.data;

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id
            ? {
                ...post,
                quantidadeCurtidas: updatedPost.quantidadeCurtidas,
                isLiked: updatedPost.jaCurtido,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Erro ao curtir promoção: ", error);
    }
  };

  const handleDeletePromotion = async (id: number) => {
    try {
      const response = await api.delete(`/Promocao/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });

      if (response.status === 200) {
        setSuccessMsg("Promoção excluída com sucesso!");
        setIsSuccess(true);
        setShowModal(true);
        setPosts(posts.filter((post) => post.id !== id));
      }
    } catch (error) {
      console.error("Erro ao deletar promoção:", error);
      setIsErrorMsg("Erro ao deletar a promoção.");
      setIsError(true);
      setShowModal(true);
    }
  };

  const confirmDelete = (id: number) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setIsErrorMsg("Para excluir, logue ou crie sua conta!");
      setIsError(true);
      setShowModal(true);
      return;
    }

    setPromoToDelete(id);
    setIsErrorMsg("Tem certeza que deseja excluir esta promoção?");
    setIsError(true);
    setShowModal(true);
  };

  const handleDeleteConfirmation = async () => {
    if (promoToDelete) {
      await handleDeletePromotion(promoToDelete);
    }
    setShowModal(false);
  };

  const handleSearch = () => {
    const query = searchQuery.trim();
    if (query) {
      navigate(`/?query=${encodeURIComponent(query)}`);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    const query = useQueryParam("query");
    setSearchQuery(query ?? "");
    userProfile();

    if (query && query.trim() !== "") {
      fetchSearchResults(query);
    } else {
      fetchFeed();
    }
  }, [location.search]);

  return (
    <>
      <NavBar />
      <div className="home-page">
        {(isError || isSuccess) && (
          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setIsError(false);
              setIsSuccess(false);
            }}
            title={isError ? "Aviso!" : "Sucesso"}
            //titleColor={isSuccess ? "#28a745" : undefined}
          >
            <div style={isSuccess ? { color: "#28a745", textAlign: "center" } : {}}>
              <p>{isError ? isErrorMsg : successMsg}</p>
            </div>
            {isError && promoToDelete && (
              <div className="modal-buttons">
                <button onClick={handleDeleteConfirmation}>Confirmar</button>
                <button onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            )}
          </Modal>
        )}

        {selectedPromo && (
          <CommentModal
            promo={selectedPromo}
            onClose={() => setSelectedPromo(null)}
            handleLikeClick={function (id: number): void {
              throw new Error("Function not implemented.");
            }}
          />
        )}

        <main className="main-container">
          {isLoading ? (
            <div className="loading">Carregando promoções...</div>
          ) : posts.length === 0 ? (
            <div className="no-posts">Nenhuma promoção encontrada.</div>
          ) : (
            <div className="card-container">
              {posts.map((post) => (
                <CardCustom
                  key={post.id}
                  promo={{
                    id: post.id,
                    username: `@${(post.usuarioNome || "").toLowerCase()}`,
                    productImage: post.imagemUrl,
                    seller: post.site,
                    productName: post.titulo,
                    price: post.preco.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }),
                    postedAgo: formatPostedAgo(post.createdAt),
                    likes: post.quantidadeCurtidas,
                    isLiked: post.isLiked ?? false,
                    comments: post.quantidadeComentarios,
                    site: post.url,
                  }}
                  handleLikeClick={() => handleLikeObj(post.id)}
                  onCommentClick={() => setSelectedPromo(post)}
                  handleDeletePublish={() => confirmDelete(post.id)}
                  userLogged={userLogged}
                />
              ))}
            </div>
          )}
        </main>

        <footer className="footer" />
      </div>
    </>
  );
}