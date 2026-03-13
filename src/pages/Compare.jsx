import React from 'react';
import { useCompare } from '../context/CompareContext';
import { FaExchangeAlt, FaTimes, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { API } from '../services/api';

export default function Compare() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/200";
    if (path.startsWith("http")) return path;
    const base = API.defaults.baseURL.replace(/\/api$/, "");
    return `${base}${path}`;
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart! 🛒`);
  };

  if (compareList.length === 0) {
    return (
      <div className="container">
        <div className="empty-state" style={{ textAlign: 'center', padding: '100px 20px', background: '#fff', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
          <FaExchangeAlt size={60} color="#ddd" style={{ marginBottom: '20px' }} />
          <h3>No products to compare</h3>
          <p>Add up to 4 products to see a side-by-side comparison.</p>
          <button onClick={() => window.location.href = '/'} className="hero-cta-btn" style={{ marginTop: '20px' }}>
            Go Shopping
          </button>
        </div>
      </div>
    );
  }

  const features = [
    { label: 'Price', key: 'price', format: (v) => `₹${v.toLocaleString()}` },
    { label: 'Type', key: 'type' },
    { label: 'Brand', key: 'brand' },
    { label: 'Socket', key: 'socket' },
    { label: 'Ram Type', key: 'ramType' },
    { label: 'Cores', key: 'cores' },
    { label: 'Threads', key: 'threads' },
    { label: 'TDP', key: 'watt', format: (v) => v ? `${v}W` : '-' },
  ];

  return (
    <div className="container" style={{ maxWidth: '1200px' }}>
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', textTransform: 'uppercase', color: '#333', borderLeft: '5px solid #3b82f6', paddingLeft: '15px' }}>Compare Products</h2>
          <p style={{ color: '#666', marginLeft: '20px' }}>Side-by-side comparison of your selected items</p>
        </div>
        <button onClick={clearCompare} style={{ padding: '10px 20px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Clear All
        </button>
      </div>

      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ padding: '20px', minWidth: '200px', borderBottom: '2px solid #f1f5f9' }}>Feature</th>
              {compareList.map(product => (
                <th key={product._id} style={{ padding: '20px', borderBottom: '2px solid #f1f5f9', minWidth: '250px', position: 'relative' }}>
                  <button 
                    onClick={() => removeFromCompare(product._id)}
                    style={{ position: 'absolute', top: '10px', right: '10px', background: '#eee', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <FaTimes size={12} />
                  </button>
                  <div style={{ textAlign: 'center' }}>
                    <img src={getImageUrl(product.image)} alt={product.name} style={{ width: '150px', height: '150px', objectFit: 'contain', marginBottom: '15px' }} />
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '10px', height: '40px', overflow: 'hidden' }}>{product.name}</h4>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', margin: '0 auto' }}
                    >
                      <FaShoppingCart size={14} /> Buy
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map(feat => (
              <tr key={feat.key} style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{ padding: '15px 20px', fontWeight: 'bold', color: '#475569', background: '#f8fafc' }}>{feat.label}</td>
                {compareList.map(product => (
                  <td key={product._id} style={{ padding: '15px 20px', color: '#1e293b' }}>
                    {feat.format ? feat.format(product[feat.key] || '') : (product[feat.key] || '-')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
