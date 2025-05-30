import React, { useState } from 'react';
import './Publish.css';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../components/Navbar';
import Footer from '../components/Footer';
import { FiImage } from 'react-icons/fi';
import api from '../services/api';

export function Publish() {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingConfirm, setIsLoadingConfirm] = useState(false);
    const [message, setMessage] = useState('');
    const [showProductDetails, setShowProductDetails] = useState(false);
    const [productDetails, setProductDetails] = useState({
        title: '',
        site: '',
        price: '',
        coupon: '',
        imageUrl: 'https://localhost:7101/images/image-not-found.png',
        url: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

            if (url && isValidUrl(url)) {
               try {
                    const token = localStorage.getItem("jwtToken");
                    
                    const response = await api.post("/Promocao/Cadastrar", {
                        urlPromocao: url,
                        cupom: '',
                        isAdd: false,
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    
                    const { promocao } = response.data as any;
                    const { cupom, imagemUrl, preco, titulo, site } = promocao;


                    setProductDetails({
                        coupon: cupom,
                        imageUrl: imagemUrl,
                        price: preco,
                        site,
                        title: titulo,
                        url
                    });

                    setMessage('');
                    setShowProductDetails(true);
                } catch (error) {
                    console.error("Erro ao cadastrar promoção:", error);
                    setMessage(error.response.data.mensagem || 'Erro ao cadastrar promoção.')
                }

            } else {
                setMessage('Por favor, insira uma URL válida');
            }
            setIsLoading(false);
    };

    const handleBack = () => {
        setShowProductDetails(false);
        setUrl('');
    };

    const handleConfirm = async () => {
        setIsLoadingConfirm(true);

         try {
            const token = localStorage.getItem("jwtToken");
            
            const response = await api.post("/Promocao/Cadastrar", {
                urlPromocao: url,
                cupom: '',
                isAdd: true,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });


            setMessage('Produto publicado com sucesso!');
            setShowProductDetails(false);

            setUrl('');
            setProductDetails({
                title: '',
                site: '',
                price: '',
                coupon: '',
                imageUrl: 'image',
                url: ''
            });
        } catch (error) {
            console.error("Erro ao cadastrar promoção:", error);
            setMessage('Erro ao cadastrar promoção!');

        }
        setIsLoadingConfirm(false);

      
    };

    const handleDetailChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'price') {
            const numericValue = value.replace(/[^0-9]/g, '');
            setProductDetails({
                ...productDetails,
                [name]: numericValue
            });
        } else {
            setProductDetails({
                ...productDetails,
                [name]: value
            });
        }
    };

    const formatPrice = (value) => {

        if (!value) return 'R$ 0,00';

        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const isValidUrl = (urlString) => {
        try {
            new URL(urlString);
            return true;
        } catch (_) {
            return false;
        }
    };

    return (
        <div className="publish-page">
            <NavBar />

            <div className="publish-container">
                {!showProductDetails ? (
                    <div className="publish-card">
                        <div className="publish-header">
                            <h2 className="publish-title">
                                <span className="gradient-text">COMPARTILHE SEU ACHADO!</span>
                            </h2>
                            <p className="publish-subtitle">Cole abaixo o link que deseja compartilhar</p>
                        </div>

                        <form onSubmit={handleSubmit} className="publish-form">
                            <div className="input-group">
                                <label htmlFor="url">URL do Produto</label>
                                <input
                                    type="url"
                                    id="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://exemplo.com/produto"
                                    className="publish-input"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="publish-button"
                                disabled={isLoading || !url}
                            >
                                {isLoading ? (
                                    <span className="loading-spinner"></span>
                                ) : (
                                    'ENVIAR'
                                )}
                            </button>

                            {message && (
                                <p className={`publish-message ${message.includes('sucesso') ? 'success' : 'error'}`}>
                                    {message}
                                </p>
                            )}
                        </form>
                    </div>
                ) : (
                    <div className="product-details-card">
                        <div className="details-header">
                            <h2 className="details-title">
                                <span className="gradient-text">DETALHES DO PRODUTO</span>
                            </h2>
                        </div>

                        <div className="details-content">
                            <div className="image-display-group">
                                <div className="image-icon-container">
                                    <FiImage className="image-icon" />
                                </div>
                                <img 
                                    src={productDetails.imageUrl } 
                                    className="product-image"
                                    
                                />
                            </div>

                            <div className="url-display-group">
                                <label className="detail-label">URL</label>
                                <div className="url-display">
                                    {url}
                                </div>
                            </div>

                            <div className="detail-input-group">
                                <label htmlFor="site" className="detail-label">Site</label>
                                <input
                                    type="text"
                                    id="site"
                                    name="site"
                                    value={productDetails.site}
                                    onChange={handleDetailChange}
                                    className="detail-input"
                                    placeholder="exemplo"
                                />
                            </div>

                            <div className="detail-input-group">
                                <label htmlFor="title" className="detail-label">Título</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={productDetails.title}
                                    onChange={handleDetailChange}
                                    className="detail-input"
                                    placeholder="Nome do produto"
                                    required
                                />
                            </div>

                            <div className="detail-input-group">
                                <label htmlFor="price" className="detail-label">Preço</label>
                                <div className="price-input-container">
                                    <input
                                        type="text"
                                        id="price"
                                        name="price"
                                        value={productDetails.price}
                                        onChange={handleDetailChange}
                                        className="detail-input"
                                        placeholder="0000 (ex: 1000 = R$ 10,00)"
                                        required
                                    />
                                    <span className="price-preview">
                                        {formatPrice(productDetails.price)}
                                    </span>
                                </div>
                            </div>

                            <div className="detail-input-group">
                                <label htmlFor="coupon" className="detail-label">Cupom</label>
                                <input
                                    type="text"
                                    id="coupon"
                                    name="coupon"
                                    value={productDetails.coupon}
                                    onChange={handleDetailChange}
                                    className="detail-input"
                                    placeholder="Código do cupom"
                                />
                            </div>
                        </div>

                        <div className="details-actions">
                            <button 
                                type="button"
                                className="publish-button secondary"
                                onClick={handleBack}
                            >
                                VOLTAR
                            </button>
                            <button 
                                type="button"
                                className="publish-button"
                                onClick={handleConfirm}
                                disabled={!productDetails.title || !productDetails.price || isLoadingConfirm}

                            >
                                 {isLoadingConfirm ? (
                                    <span className="loading-spinner"></span>
                                ) : (
                                    'CONFIRMAR PUBLICAÇÃO'
                                )}
                            </button>
                            
                        </div>
                    </div>
                )}
            </div>
             <Footer />
        </div>
    );
}