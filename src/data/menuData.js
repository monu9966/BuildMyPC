import { menuData } from "../data/menuData";

// ... inside your Navbar component
const [activeMenu, setActiveMenu] = useState(null);

return (
  <nav>
    {/* Secondary Navbar Buttons generated from data */}
    <div className="secondary-nav" onMouseLeave={() => setActiveMenu(null)}>
      {menuData.map((category) => (
        <div key={category.id} className="menu-trigger-container">
          <button 
            onMouseEnter={() => setActiveMenu(category.id)}
            className="nav-btn"
          >
            {category.title}
          </button>

          {/* Render the Mega Menu Card only if this category is active */}
          {activeMenu === category.id && (
            <div className="mega-menu-card">
              {category.columns.map((col, index) => (
                <div key={index} className="menu-column">
                  <h3>{col.header}</h3>
                  {col.links.map((link, lIndex) => (
                    <Link 
                      key={lIndex} 
                      to={link.path} 
                      onClick={() => setActiveMenu(null)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </nav>
);