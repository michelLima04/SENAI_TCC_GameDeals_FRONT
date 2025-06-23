import { FaClock, FaComment, FaHeart, FaRegHeart } from "react-icons/fa";
import "./CardCustom.css";

export function CardCustom({ promo, handleLikeClick, onCommentClick }) {
  return (
    <>
      <div
        className="product-card clickable-card"
        onClick={(e) => {
          e.stopPropagation();
          onCommentClick(promo);
        }}
      >
        <div className="card-header">
          <div className="user-info">
            <span>👤 {promo.username}</span>
          </div>
        </div>

        <div className="card-image">
          <img src={promo.productImage} alt="Produto" />
        </div>

        <div className="card-details">
          <p className="product-seller">
            Vendido por <span className="product-company">{promo.seller}</span>
          </p>
          <h3 className="product-name">{promo.productName}</h3>
          <p className="product-price">{promo.price}</p>

          <div className="promo-meta">
            <span className="promo-time">
              <FaClock className="meta-icon" /> {promo.postedAgo}
            </span>
            <span
              className="promo-likes"
              onClick={(e) => {
                e.stopPropagation();
                handleLikeClick(promo.id);
              }}
            >
              {promo.isLiked ? (
                <FaHeart className="meta-icon liked" />
              ) : (
                <FaRegHeart className="meta-icon" />
              )}{" "}
              {promo.likes}
            </span>
            <span
              className="promo-comments"
              onClick={(e) => {
                e.stopPropagation();
                onCommentClick(promo);
              }}
            >
              <FaComment className="meta-icon" /> {promo.comments}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
