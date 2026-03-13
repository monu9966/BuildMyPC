import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchSearchResults } from "../services/endpoints";
import { useCart } from "../context/CartContext";
import { API } from "../services/api";
import {
  FaHome,
  FaTools,
  FaShoppingCart,
  FaClipboardList,
  FaSignOutAlt,
  FaUserPlus,
  FaSignInAlt,
  FaBars,
  FaTimes,
  FaShieldAlt,
  FaSearch,
  FaArrowLeft,
  FaChevronDown,
  FaCogs,
  FaMicrochip,
  FaVideo,
  FaMemory,
  FaHdd,
  FaPlug,
  FaServer,
  FaDesktop,
  FaKeyboard,
  FaMouse,
  FaHeadset,
  FaGamepad,
  FaUsb,
  FaBatteryFull,
  FaBolt,
  FaFan,
  FaExchangeAlt,
  FaHeart
} from "react-icons/fa";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const navRef = useRef(null);

  // UI States
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  // inside export default function Navbar() { ...
  const [activeMenu, setActiveMenu] = useState(null);

  // This function closes the menu when the mouse leaves the entire nav area
  const handleMouseLeave = () => setActiveMenu(null);

  // Search States
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  // --- 1. SEARCH LOGIC (Debounced) ---
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 1) {
        try {
          const data = await fetchSearchResults(query);
          setResults(data);
          setShowResults(true);
        } catch (err) {
          console.error("Search failed", err);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // --- 2. EVENT HANDLERS ---
  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false);
        setDropOpen(false);
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/50";
    if (path.startsWith("http")) return path;
    const base = API.defaults.baseURL.replace(/\/api$/, "");
    return `${base}${path}`;
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
    setShowResults(false);
    setIsMobileSearchOpen(false);
    setQuery("");
    setResults([]);
  };

  return (
    <>
      <nav className="navbar" ref={navRef}>
        {/* Logo Section */}
        <Link to="/" className="logo-box" onClick={closeMenu}>
          <img src={logo} alt="BuildMyPC Logo" className="logo-img" />
          <span className="logo-text">BuildMyPC</span>
        </Link>

        {/* --- 2. Mobile Search Trigger --- */}
        <button
          className="mobile-search-trigger"
          onClick={() => setIsMobileSearchOpen(true)}
        >
          <FaSearch />
        </button>

        {/* --- 1. Desktop Search Section --- */}
        <div className="search-desktop">
          <div className="nav-search-wrapper">
            <div className={`search-bar-container ${query ? "active" : ""}`}>
              <input
                type="text"
                placeholder="Search for products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.length > 1 && setShowResults(true)}
              />
              <FaSearch className="search-icon" />
              {query && (
                <FaTimes
                  className="clear-icon"
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                  }}
                />
              )}
            </div>

            {/* Desktop Results Dropdown */}
            {showResults && results.length > 0 && (
              <div className="search-dropdown-menu">
                <div className="dropdown-header">Products Found</div>
                {results.map((item) => (
                  <div
                    key={item._id}
                    className="search-item-row"
                    onClick={() => handleProductClick(item._id)}
                  >
                    <img 
                      src={getImageUrl(item.image)} 
                      alt="" 
                      className="search-item-img" 
                    />
                    <div className="item-info">
                      <p className="item-name">{item.name}</p>
                      <span className="item-category">
                        {item.category || "Component"}
                      </span>
                    </div>
                    <p className="item-price">₹{item.price.toLocaleString()}</p>
                  </div>
                ))}
                <div className="dropdown-footer">
                  Press Enter to see all results
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- 3. Full Screen Mobile Overlay --- */}
        {isMobileSearchOpen && (
          <div className="mobile-search-overlay">
            <div className="overlay-header">
              <button onClick={() => setIsMobileSearchOpen(false)}>
                <FaArrowLeft />
              </button>
              <input
                autoFocus
                type="text"
                placeholder="Search components..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <FaTimes
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                  }}
                />
              )}
            </div>

            <div className="mobile-results">
              {results.map((item) => (
                <div
                  key={item._id}
                  className="mobile-result-card"
                  onClick={() => handleProductClick(item._id)}
                >
                  <img 
                    src={getImageUrl(item.image)} 
                    alt="" 
                    className="mobile-result-img" 
                  />
                  <div className="mobile-item-details">
                    <span className="mobile-item-name">{item.name}</span>
                    <span className="mobile-item-cat">{item.category}</span>
                  </div>
                  <span className="price">₹{item.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hamburger Toggle */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </div>

        {/* Navigation Links */}
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <NavItem to="/" icon={<FaHome />} text="Home" onClick={closeMenu} />
          <NavItem
            to="/builder"
            icon={<FaTools />}
            text="PC Builder"
            onClick={closeMenu}
          />
          <NavItem to="/compare" icon={<FaExchangeAlt />} text="Compare" onClick={closeMenu} />
          <NavItem to="/wishlist" icon={<FaHeart />} text="Wishlist" onClick={closeMenu} />

          <div className="mobile-only-categories">
            <div className="sec-nav-item" onClick={closeMenu}>
              <span>All Category</span>
              <FaChevronDown className="sec-nav-icon" />
            </div>
            <div className="sec-nav-item" onClick={closeMenu}>
              <span>PC Components</span>
              <FaChevronDown className="sec-nav-icon" />
            </div>
            <div className="sec-nav-item" onClick={closeMenu}>
              <span>Peripherals</span>
              <FaChevronDown className="sec-nav-icon" />
            </div>
            <div className="sec-nav-item" onClick={closeMenu}>
              <span>PC Accessories</span>
              <FaChevronDown className="sec-nav-icon" />
            </div>
          </div>

          {user && (
            <>
              <NavItem
                to="/cart"
                onClick={closeMenu}
                icon={
                  <div className="cart-icon-wrapper">
                    <FaShoppingCart />
                    {cartCount > 0 && (
                      <span className="cart-badge">{cartCount}</span>
                    )}
                  </div>
                }
                text="My Cart"
              />
              {user.role === "admin" && (
                <NavItem
                  to="/admin"
                  icon={<FaShieldAlt />}
                  text="Admin"
                  onClick={closeMenu}
                />
              )}
            </>
          )}

          {user ? (
            <div className="user-dropdown">
              <div
                className="user-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropOpen((o) => !o);
                }}
              >
                <span className="user-name">Hi, {user.name} 👋</span>
                <img
                  src={getImageUrl(user.avatar)}
                  className="nav-avatar"
                  alt="avatar"
                />
              </div>

              {dropOpen && (
                <div className="dropdown-menu">
                  <NavItem
                    to="/profile"
                    text="👤 Profile"
                    onClick={() => {
                      closeMenu();
                      setDropOpen(false);
                    }}
                  />
                  <NavItem
                    to="/orders"
                    icon={<FaClipboardList />}
                    text="Orders"
                    onClick={() => {
                      closeMenu();
                      setDropOpen(false);
                    }}
                  />
                  <NavItem
                    to="/my-builds"
                    icon={<FaTools />}
                    text="My Builds"
                    onClick={() => {
                      closeMenu();
                      setDropOpen(false);
                    }}
                  />
                  <button
                    onClick={() => {
                      handleLogout();
                      setDropOpen(false);
                    }}
                    className="logout-btn"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn" onClick={closeMenu}>
                <FaSignInAlt /> Login
              </Link>
              <Link to="/register" className="signup-btn" onClick={closeMenu}>
                <FaUserPlus /> Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* --- Secondary Navbar for Categories --- */}
      <div className="secondary-navbar" onMouseLeave={handleMouseLeave}>
        <div
          className="sec-nav-item"
          onMouseEnter={() => setActiveMenu("category")}
        >
          <span>All Category</span>
          <FaChevronDown className="sec-nav-icon" />
        </div>
              {/* Mega Menu Card  */}
        {activeMenu === "category" && (
          <div className="mega-menu-card category-mega">
            {/* Column 1: Core Components */}
            <div className="menu-column">
              <div className="category-section">
                <h3><FaMicrochip /> Processor</h3>
                <div className="sub-links">
                  <Link to="/products/intel">Intel Processor</Link>
                  <Link to="/products/amd">AMD Processor</Link>
                </div>
              </div>

              <div className="category-section mt-4">
                <h3><FaShieldAlt /> Motherboard</h3>
                <div className="sub-links">
                  <Link to="/products/amd-mb">AMD Motherboard</Link>
                  <Link to="/products/intel-mb">Intel Motherboard</Link>
                </div>
              </div>

              <div className="category-section mt-4">
                <h3><FaFan /> CPU Cooler</h3>
                <div className="sub-links">
                  <Link to="/products/air-cooler">Air Cooler</Link>
                  <Link to="/products/liquid-cooler">AIO Liquid Cooler</Link>
                </div>
              </div>

              <div className="category-section mt-4">
                <h3><FaMemory /> RAM</h3>
                <div className="sub-links">
                  <Link to="/products/ddr4">DDR4 Memory</Link>
                  <Link to="/products/ddr5">DDR5 Memory</Link>
                </div>
              </div>
            </div>

            {/* Column 2: Storage & Power */}
            <div className="menu-column">
              <div className="category-item">
                <h3><FaVideo /> Graphics Card</h3>
              </div>
              <div className="category-item mt-3">
                <h3><FaHdd /> Internal SSD</h3>
              </div>
              <div className="category-item mt-3">
                <h3><FaHdd /> Hard Drive</h3>
              </div>
              <div className="category-item mt-3">
                <h3><FaPlug /> Power Supply</h3>
              </div>
              <div className="category-item mt-3">
                <h3><FaServer /> Cabinets</h3>
              </div>
              <div className="category-item mt-3">
                <h3><FaFan /> Case Fans</h3>
              </div>
            </div>

            {/* Column 3: Peripherals */}
            <div className="menu-column">
              <div className="category-item">
                <h3><FaDesktop /> Monitor</h3>
              </div>
              <div className="category-item mt-3">
                <h3><FaKeyboard /> Keyboard</h3>
              </div>
              <div className="category-item mt-3">
                <h3><FaMouse /> Mouse</h3>
              </div>
              <div className="category-item mt-3">
                <h3><FaMouse /> Mousepad</h3>
              </div>
              <div className="category-item mt-3">
                <h3><FaHeadset /> Headset</h3>
              </div>
              <div className="category-item mt-3">
                <h3><FaGamepad /> Controller</h3>
              </div>
            </div>

            {/* Column 4: Accessories */}
            <div className="menu-column">
              <div className="category-item">
                <h3><FaCogs /> Custom Cables</h3>
              </div>
              <div className="category-item mt-3">
                <h3><FaBatteryFull /> UPS</h3>
              </div>
              <div className="category-item mt-3">
                <h3><FaHdd /> External SSD</h3>
              </div>
              <div className="category-item mt-3">
                <h3><FaBolt /> Power Strip</h3>
              </div>
              <div className="category-item mt-3">
                <h3><FaUsb /> USB Devices</h3>
              </div>
            </div>
          </div>
        )}        

        <div
          className="sec-nav-item"
          onMouseEnter={() => setActiveMenu("components")}
        >
          <span>PC Components</span>
          <FaChevronDown className="sec-nav-icon" />
        </div>
        {/* Mega Menu Card  */}
        {activeMenu === "components" && (
          <div className="mega-menu-card category-mega">
            <div className="menu-column">
              <div className="category-section">
                <h3><FaMicrochip /> Processor</h3>
                <div className="sub-links">
                  <Link to="/products/intel">Intel Processor</Link>
                  <Link to="/products/amd">AMD Processor</Link>
                </div>
              </div>
              <div className="category-section mt-4">
                <h3><FaShieldAlt /> Motherboard</h3>
                <div className="sub-links">
                  <Link to="/products/amd-mb">AMD Motherboard</Link>
                  <Link to="/products/intel-mb">Intel Motherboard</Link>
                </div>
              </div>
            </div>
            <div className="menu-column">
              <div className="category-item"><h3><FaVideo /> Graphics Card</h3></div>
              <div className="category-item mt-3"><h3><FaHdd /> Internal SSD</h3></div>
              <div className="category-item mt-3"><h3><FaFan /> Case Fans</h3></div>
            </div>
            <div className="menu-column">
              <div className="category-item"><h3><FaPlug /> Power Supply</h3></div>
              <div className="category-item mt-3"><h3><FaServer /> Cabinets</h3></div>
              <div className="category-item mt-3"><h3><FaTools /> Thermal Paste</h3></div>
            </div>
          </div>
        )}

        <div
          className="sec-nav-item"
          onMouseEnter={() => setActiveMenu("peripherals")}
        >
          <span>Peripherals</span>
          <FaChevronDown className="sec-nav-icon" />
        </div>
        {/* Mega Menu Card  */}
        {activeMenu === "peripherals" && (
          <div className="mega-menu-card category-mega">
            <div className="menu-column">
              <div className="category-item"><h3><FaDesktop /> Monitor</h3></div>
              <div className="category-item mt-3"><h3><FaKeyboard /> Keyboard</h3></div>
            </div>
            <div className="menu-column">
              <div className="category-item"><h3><FaMouse /> Mouse</h3></div>
              <div className="category-item mt-3"><h3><FaMouse /> Mousepad</h3></div>
            </div>
            <div className="menu-column">
              <div className="category-item"><h3><FaHeadset /> Headset</h3></div>
              <div className="category-item mt-3"><h3><FaGamepad /> Controller</h3></div>
            </div>
          </div>
        )}
        <div
          className="sec-nav-item"
          onMouseEnter={() => setActiveMenu("accessories")}
        >
          <span>PC Accessories</span>
          <FaChevronDown className="sec-nav-icon" />
        </div>
        {/* Mega Menu Card  */}
        {activeMenu === "accessories" && (
          <div className="mega-menu-card category-mega">
            <div className="menu-column">
              <div className="category-item"><h3><FaCogs /> Custom Cables</h3></div>
              <div className="category-item mt-3"><h3><FaBatteryFull /> UPS</h3></div>
            </div>
            <div className="menu-column">
              <div className="category-item"><h3><FaHdd /> External SSD</h3></div>
              <div className="category-item mt-3"><h3><FaBolt /> Power Strip</h3></div>
            </div>
            <div className="menu-column">
              <div className="category-item"><h3><FaUsb /> USB Devices</h3></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function NavItem({ to, icon, text, onClick }) {
  return (
    <Link to={to} className="nav-item" onClick={onClick}>
      {icon}
      <span>{text}</span>
    </Link>
  );
}
