import { FaHeart, FaRegHeart, FaCartPlus, FaBolt, FaExchangeAlt } from "react-icons/fa";
import { API } from "../services/api";
import { useWishlist } from "../context/WishlistContext";
import { useCompare } from "../context/CompareContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { wishlist, toggleWishlist } = useWishlist();
  const { compareList, toggleCompare } = useCompare();
  const isLiked = wishlist.some(item => item._id === product._id);
  const isComparing = compareList.some(item => item._id === product._id);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleLike = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleCompare = (e) => {
    e.stopPropagation();
    toggleCompare(product);
  };

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/200";
    if (path.startsWith("http")) return path;
    const base = API.defaults.baseURL.replace(/\/api$/, "");
    return `${base}${path}`;
  };

  const imageUrl = getImageUrl(product.image);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    alert(`${product.name} added to cart! 🛒`);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    addToCart(product);
    navigate("/cart");
  };

  const handleNavigateToDetails = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="product-card">
      <div className="card-image-box" onClick={handleNavigateToDetails} style={{ cursor: 'pointer' }}>
        <img src={imageUrl} alt={product.name} />
        <div className="card-badges">
          <button 
            className={`wishlist-btn ${isLiked ? 'active' : ''}`} 
            onClick={handleLike}
            title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            {isLiked ? <FaHeart color="#ef4444" /> : <FaRegHeart />}
          </button>
          <button 
            className={`compare-btn ${isComparing ? 'active' : ''}`} 
            onClick={handleCompare}
            title={isComparing ? "Remove from Compare" : "Add to Compare"}
          >
            <FaExchangeAlt color={isComparing ? "#3b82f6" : "#ccc"} />
          </button>
        </div>
      </div>
      
      <div className="card-info" onClick={handleNavigateToDetails} style={{ cursor: 'pointer' }}>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">₹{product.price.toLocaleString()}</p>
      </div>

      <div className="card-actions">
        <button className="add-cart-btn" onClick={handleAddToCart}>
          <FaCartPlus /> Add To Cart
        </button>
        <button className="buy-now-btn" onClick={handleBuyNow}>
          <FaBolt /> Buy Now
        </button>
      </div>
    </div>
  );
}
