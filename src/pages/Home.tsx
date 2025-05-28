// Home.tsx
import React, { useEffect, useState } from 'react';
import './Home.css';
import { NavBar } from '../components/Navbar';
import { FaHeart, FaRegHeart, FaClock, FaComment } from 'react-icons/fa';
import { CardCustom } from '../components/CardCustom';
import api from '../services/api';
import Modal from '../components/Modal';

type Post = {
  id: number;
  titulo: string;
  preco: number;
  cupom: string;
  imagemUrl: string;
  site: string;
  tempoPostado: string;
  username: string;
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
 async function fetchFeed() {
    try {
      const response = await api.get<Post[]>('/Promocao/Feed');
      setPosts(response.data);
    } catch (error) {
      console.error("Erro ao buscar feed:", error);
    }
  }

  async function handleLikeObj(id) {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
          setIsErrorMsg("Por favor se autentique antes de curtir.");
          setIsError(true);
          setShowModal(true);
        return;
      }
      const uri = `/Promocao/Feed/${id}/like`;
      const response = await api.post<UpdatedPostResponse>(uri, {
          
      }, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });

    const updatedPost = response.data;

    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === id
          ? {
              ...post,
              quantidadeCurtidas: updatedPost.quantidadeCurtidas,
              isLiked: updatedPost.jaCurtido
            }
          : post
      )
    );
    } catch (error) {
      console.error("Erro ao buscar feed: ", error)
    }
  }

  useEffect(() => {
     fetchFeed()
  }, [])

  const [posts, setPosts] = useState<Post[]>([]);
  const [promoPosts, setPromoPosts] = useState<Post[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isErrorMsg, setIsErrorMsg] = useState("");

  return (
    <div className="home-page">
      <NavBar />
      {isError && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Minha Modal"
        >
          <p>{isErrorMsg || "Erro interno por favor consulte o administrador."}</p>
        </Modal>
      )}
      <main className="main-container">
        <div className="card-container">
          {posts.map(post => (
            <CardCustom 
            key={post.id}
              promo={{ id: post.id,
                  username: `@${(post.username || "").toLowerCase()}`,
                  productImage: post.imagemUrl,
                  seller: post.site,
                  productName: post.titulo,
                  price: post.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                  postedAgo: '2 horas atrás',
                  likes: post.quantidadeCurtidas,
                  isLiked: false,
                  comments: post.quantidadeComentarios 
                }}
              handleCardClick={(id) => console.log("Abrir detalhes da promoção", id)}
              handleLikeClick={(id => handleLikeObj(id))}
            />
          ))}

        </div>
      </main>
      <footer className="footer"></footer>
    </div>
  );
}