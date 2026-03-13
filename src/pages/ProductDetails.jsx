import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchProductById } from "../services/endpoints";
import { FaShoppingCart, FaBolt, FaHeart, FaRegHeart, FaExchangeAlt } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useCompare } from "../context/CompareContext";
import { API } from "../services/api";

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { wishlist, toggleWishlist } = useWishlist();
    const { compareList, toggleCompare } = useCompare();
    
    const [product, setProduct] = useState(null);
    const isLiked = product ? wishlist.some(item => item._id === product._id) : false;
    const isComparing = product ? compareList.some(item => item._id === product._id) : false;

    useEffect(() => {
        const getProduct = async () => {
            try {
                const data = await fetchProductById(id);
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        }
        getProduct();
    }, [id]);

    const getImageUrl = (path) => {
        if (!path) return "https://via.placeholder.com/400";
        if (path.startsWith("http")) return path;
        const base = API.defaults.baseURL.replace(/\/api$/, "");
        return `${base}${path}`;
    };

    const handleAddToCart = () => {
        addToCart(product);
        alert(`${product.name} added to cart! 🛒`);
    };

    const handleBuyNow = () => {
        addToCart(product);
        navigate("/cart");
    };

    if (!product) return <div className="loader">Loading...</div>;

    const discount = (product.originalPrice && product.originalPrice > product.price) 
        ? product.originalPrice - product.price 
        : null;

    return (
        <div className="details-container">
            <div className="details-grid">
                <div className="image-section" style={{ position: 'relative' }}>
                    <img src={getImageUrl(product.image)} alt={product.name} className="product-image" />
                    <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button 
                            onClick={() => toggleWishlist(product)}
                            style={{ background: '#fff', border: 'none', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', cursor: 'pointer' }}
                        >
                            {isLiked ? <FaHeart color="#ef4444" size={20} /> : <FaRegHeart size={20} />}
                        </button>
                        <button 
                            onClick={() => toggleCompare(product)}
                            style={{ background: isComparing ? '#eff6ff' : '#fff', border: isComparing ? '1px solid #3b82f6' : 'none', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', cursor: 'pointer' }}
                        >
                            <FaExchangeAlt color={isComparing ? "#3b82f6" : "#666"} size={20} />
                        </button>
                    </div>
                </div>
                <div className="info-section">
                    <span className="category-tag">{product.type?.toUpperCase()}</span>
                    <h1 className="prod-title">{product.name}</h1>
                    <div className="price-box">
                        <span className="final-price">₹{product.price?.toLocaleString()}</span>
                        {discount && (
                            <>
                                <span className="original-price">₹{product.originalPrice?.toLocaleString()}</span>
                                <span className="discount-tag">Save ₹{discount.toLocaleString()}</span>
                            </>
                        )}
                    </div>

                    <div className="specs-grid">
                        {product.brand && <div><strong>Brand:</strong> {product.brand}</div>}
                        {product.socket && <div><strong>Socket:</strong> {product.socket}</div>}
                        {product.cores && <div><strong>Cores:</strong> {product.cores}</div>}
                        {product.threads && <div><strong>Threads:</strong> {product.threads}</div>}
                        {product.watt > 0 && <div><strong>TDP:</strong> {product.watt}W</div>}
                        {product.ramType && <div><strong>RAM Type:</strong> {product.ramType}</div>}
                    </div>

                    <div className="action-btns">
                        <button className="add-to-cart" onClick={handleAddToCart}>
                            <FaShoppingCart /> Add to Cart
                        </button>
                        <button className="buy-now" onClick={handleBuyNow}>
                            <FaBolt /> Buy Now
                        </button>
                    </div>
                </div>

            </div>
            <div className="description-box">
                <h2>Product Description</h2>
                <p>{product.description || "No description available for this product."}</p>
            </div>
        </div>
    );
}