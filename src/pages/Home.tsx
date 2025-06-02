import React, { useEffect, useState } from "react";
import "./Home.css";
import { NavBar } from "../components/NavBar";
import { CardCustom } from "../components/CardCustom";
import api from "../services/api";
import Modal from "../components/Modal";
import { CommentModal } from "../components/CommentModal";
import { useLocation, useNavigate } from "react-router-dom";

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
  isLiked?: boolean;
  created_at: string;
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

  const useQueryParam = (key: string) => {
    return new URLSearchParams(location.search).get(key);
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

  const handleLikeObj = async (id: number) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setIsErrorMsg("Por favor se autentique antes de curtir.");
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
    fetchFeed(query);
  }, [location.search]);

  return (
    <div className="home-page">
      <NavBar />

      {isError && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Erro"
        >
          <p>
            {isErrorMsg || "Erro interno, por favor consulte o administrador."}
          </p>
        </Modal>
      )}

      {selectedPromo && (
        <CommentModal
          promo={selectedPromo}
          onClose={() => setSelectedPromo(null)}
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
                  postedAgo: "2 horas atrás",
                  likes: post.quantidadeCurtidas,
                  isLiked: post.isLiked ?? false,
                  comments: post.quantidadeComentarios,
                }}
                handleLikeClick={() => handleLikeObj(post.id)}
                onCommentClick={() => setSelectedPromo(post)}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="footer" />
    </div>
  );
}
