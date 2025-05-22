// Home.tsx
import React, { useEffect, useState } from 'react';
import './Home.css';
import { NavBar } from '../components/Navbar';
import { FaHeart, FaRegHeart, FaClock, FaComment } from 'react-icons/fa';
import { CardCustom } from '../components/CardCustom';
import api from '../services/api';

type Post = {
  id: number;
  titulo: string;
  preco: number;
  cupom: string;
  imagemUrl: string;
  site: string;
  tempoPostado: string;
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

  useEffect(() => {
     fetchFeed()
  }, [])

  const [posts, setPosts] = useState<Post[]>([]);
  const [promoPosts, setPromoPosts] = useState([
    {
      id: 1,
      username: '@limamichel04',
      productImage: 'https://m.media-amazon.com/images/I/71S9dis6PRL._AC_SX679_.jpg',
      seller: 'Amazon',
      productName: 'Headphone Fone de Ouvido Havit HV-H2002d',
      price: 'R$229,98',
      postedAgo: '2 horas atrás',
      likes: 15,
      isLiked: false,
      comments: 8 // Número estático de comentários
    },
    {
      id: 2,
      username: '@gamergirl',
      productImage: 'https://m.media-amazon.com/images/I/61BGE6iu4AL._AC_SX679_.jpg',
      seller: 'Kabum',
      productName: 'Teclado Mecânico Gamer Redragon Kumara',
      price: 'R$199,90',
      postedAgo: '1 dia atrás',
      likes: 42,
      isLiked: false,
      comments: 23 // Número estático de comentários
    }
  ]);

  const handleCardClick = (id: number) => {
    console.log(`Card ${id} clicado`);
  };

  const handleLikeClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o evento de clique do card seja acionado
    setPromoPosts(promoPosts.map(promo => {
      if (promo.id === id) {
        return {
          ...promo,
          likes: promo.isLiked ? promo.likes - 1 : promo.likes + 1,
          isLiked: !promo.isLiked
        };
      }
      return promo;
    }));
  };

  return (
    <div className="home-page">
      <NavBar />
      <main className="main-container">
        <div className="card-container">
          {posts.map(post => (
            <CardCustom 
              promo={{ id: post.id,
                  username: '@limamichel04',
                  productImage: post.imagemUrl,
                  seller: post.site,
                  productName: post.titulo,
                  price: post.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                  postedAgo: '2 horas atrás',
                  likes: 15,
                  isLiked: false,
                  comments: 8 
                }}
              handleCardClick={(id) => console.log("Abrir detalhes da promoção", id)}
              handleLikeClick={(id) => console.log("Curtir promoção", id)}
            />
          ))}

        </div>
      </main>
      <footer className="footer"></footer>
    </div>
  );
}