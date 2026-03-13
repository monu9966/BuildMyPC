import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { FaHeart } from 'react-icons/fa';

export default function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <div className="container">
      <div className="section-header" style={{ marginBottom: '30px', borderLeft: '5px solid #ef4444', paddingLeft: '15px' }}>
        <h2 style={{ fontSize: '2.5rem', textTransform: 'uppercase', color: '#333' }}>Your Wishlist</h2>
        <p style={{ color: '#666' }}>{wishlist.length} items saved for later</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-state" style={{ textAlign: 'center', padding: '100px 20px', background: '#fff', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
          <FaHeart size={60} color="#ddd" style={{ marginBottom: '20px' }} />
          <h3>Your wishlist is empty</h3>
          <p>Explore products and add them to your wishlist!</p>
          <button onClick={() => window.location.href = '/'} className="hero-cta-btn" style={{ marginTop: '20px' }}>
            Go Shopping
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
