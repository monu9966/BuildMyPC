import { useNavigate } from "react-router-dom";
import UsageCard from "../components/UsageCard";
import ProductCard from "../components/ProductCard";
import { useState, useEffect } from "react";
import { getComponents } from "../services/endpoints";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { FaGamepad, FaBriefcase, FaUserGraduate, FaPlay, FaCheckCircle, FaMoneyBillWave, FaShareAlt, FaCogs } from "react-icons/fa";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import banner1 from "../assets/banners/banner1.jpg";
import banner2 from "../assets/banners/banner2.jpg";
import banner3 from "../assets/banners/banner3.jpg";
import banner4 from "../assets/banners/banner4.jpg";
import banner5 from "../assets/banners/banner5.jpg";
import banner6 from "../assets/banners/banner6.jpg";
import banner7 from "../assets/banners/banner7.jpg";
import banner8 from "../assets/banners/banner8.jpg";
import banner9 from "../assets/banners/banner9.jpg";
import banner10 from "../assets/banners/banner10.jpg";
import banner11 from "../assets/banners/banner11.jpg";

export default function Home() {
  const bannerImages = [
    { id: 1, url: banner1, alt: "Latest GPUs" },
    { id: 2, url: banner2, alt: "RGB Gaming Setup" },
    { id: 3, url: banner3, alt: "Custom PC Builds" },
    { id: 4, url: banner4, alt: "Custom PC Builds" },
    { id: 5, url: banner5, alt: "Custom PC Builds" },
    { id: 6, url: banner6, alt: "Custom PC Builds" },
    { id: 7, url: banner7, alt: "Custom PC Builds" },
    { id: 8, url: banner8, alt: "Custom PC Builds" },
    { id: 9, url: banner9, alt: "Custom PC Builds" },
    { id: 10, url: banner10, alt: "Custom PC Builds" },
    { id: 11, url: banner11, alt: "Custom PC Builds" },
  ];

  const [usage, setUsage] = useState(null);
  const [bestSellers, setBestSellers] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
  getComponents()
    .then((res) => {
      // 1. Check if res and res.data exist first (Defensive Programming)
      if (res && res.data) {
        // Handle different possible response structures (res.data.data OR res.data)
        const allData = Array.isArray(res.data.data) ? res.data.data : res.data;

        // 2. Ensure allData is an array before filtering
        if (Array.isArray(allData)) {
          const filtered = allData.filter(c => c.isBestSeller);
          setBestSellers(filtered);
        } else {
          console.warn("Expected an array but received:", allData);
          setBestSellers([]); // Set empty array to prevent map() errors
        }
      }
    })
    .catch((err) => {
      console.error("Error fetching best sellers:", err);
      setBestSellers([]); // Handle error by clearing best sellers
    });
}, []);

  return (
    <div className="home">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="home-slider">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            effect="fade"
            spaceBetween={0}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            className="mySwiper"
          >
            {bannerImages.map((image) => (
              <SwiperSlide key={image.id}>
                <div className="slider-img-container">
                  <div className="slider-dark-veil"></div>
                  <img src={image.url} alt={image.alt} className="slider-img" />          
                </div>        
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Global Hero Overlay */}
        <div className="hero-overlay">
          <div className="hero-content-box">
            <h1 className="hero-title">Build Your Dream PC</h1>
            <p className="hero-subtitle">Select compatible components within your budget</p>
            <button onClick={() => navigate("/builder")} className="hero-cta-btn">
              <FaPlay className="play-icon" /> Start Building
            </button>
          </div>
        </div>
      </section>

      {/* USAGE SECTION */}
      <section className="usage-section">
        <div className="usage-header">
          <h2>Select PC Usage</h2>
          <p>Choose your primary use case to get the best component recommendations.</p>
        </div>
        
        <p className="selected-usage">
          Currently Selected: <span className="highlight-usage">{usage || "None"}</span>
        </p>

        <div className="usage-grid">
          <UsageCard
            title="Gaming"
            icon={<FaGamepad />}
            description="High frame rates and stunning graphics"
            selected={usage === "Gaming"}
            onClick={() => setUsage("Gaming")}
          />
          <UsageCard
            title="Office"
            icon={<FaBriefcase />}
            description="Reliable, fast, and multi-tasking ready"
            selected={usage === "Office"}
            onClick={() => setUsage("Office")}
          />
          <UsageCard
            title="Student"
            icon={<FaUserGraduate />}
            description="Affordable learning and creativity"
            selected={usage === "Student"}
            onClick={() => setUsage("Student")}
          />
        </div>
      </section>

      {/* BEST SELLERS SECTION */}
      {bestSellers.length > 0 && (
        <section className="best-sellers-section">
          <div className="container">
            <h2>Best Sellers</h2>
            <div className="product-grid">
              {bestSellers.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FEATURES SECTION */}
      <section className="features-section">
        <div className="features-header">
          <h2>Why BuildMyPC?</h2>
          <p>We make building your next PC simple, accurate, and fun.</p>
        </div>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon"><FaCheckCircle /></div>
            <h3>Compatibility Check</h3>
            <p>We ensure all your parts work together perfectly seamlessly.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaMoneyBillWave /></div>
            <h3>Budget Optimization</h3>
            <p>Get the absolute most performance for every dollar you spend.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaShareAlt /></div>
            <h3>Save & Share Builds</h3>
            <p>Keep your lists saved for later or easily share them with friends.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaCogs /></div>
            <h3>Component Tracking</h3>
            <p>Access our large, constantly updated, database with new PC parts.</p>
          </div>
        </div>
      </section>
    </div>
  );
}