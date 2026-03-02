import { useMemo } from "react";
import defaultImg from "../assets/default-avatar.png";

export default function SelectBox({
  title,
  options = [],
  onSelect,
  isOpen,
  setOpenBox,
  selected,
}) {
  const [search, setSearch] = useMemo(() => [ "", () => {} ], []);

  /* ===== Filter ===== */
  const filteredOptions = useMemo(() => {
    return options.filter((item) => {
      const s = search.toLowerCase();

      return (
        item.name?.toLowerCase().includes(s) ||
        item.socket?.toLowerCase().includes(s) ||
        item.ramType?.toLowerCase().includes(s) ||
        item.brand?.toLowerCase().includes(s) ||
        item.price?.toString().includes(s)
      );
    });
  }, [options, search]);

  return (
    <div className="builder-card">
      <h3>{title}</h3>

      {/* SELECT BUTTON */}
      <div
        className="builder-select"
        onClick={(e) => {
          e.stopPropagation();
          setOpenBox(prev => prev === title ? null : title);
        }}
      >
        {selected?.name || `Select ${title}`}
      </div>

      {/* PREVIEW */}
      {selected && (
        <div className="preview-box">
          <img
            src={selected.image || defaultImg}
            onError={(e)=> e.target.src = defaultImg}
            alt={selected.name}
          />
          <h4>{selected.name}</h4>
          <p>₹{selected.price}</p>
        </div>
      )}

      {/* DROPDOWN */}
      {isOpen && (
        <div className="dropdown-cards" onClick={(e) => e.stopPropagation()}>
          <input
            className="search-box"
            placeholder="Search component..."
            onChange={(e) => setSearch(e.target.value)}
          />

          {filteredOptions.length === 0 ? (
            <p className="no-result">No results found</p>
          ) : (
            filteredOptions.map(item => (
              <div
                key={item._id}
                className={`dropdown-card ${
                  selected?._id === item._id ? "selected-card" : ""
                }`}
                onClick={() => {
                  onSelect(item);
                  setOpenBox(null);
                }}
              >
                <img
                  src={item.image || defaultImg}
                  alt={item.name}
                  className="dropdown-img"
                  onError={(e)=> e.target.src = defaultImg}
                />

                <div className="dropdown-info">
                  <h4>{item.name}</h4>
                  <p>₹{item.price}</p>
                  {item.socket && <p>Socket: {item.socket}</p>}
                  {item.ramType && <p>RAM: {item.ramType}</p>}
                  {item.watt && <p>{item.watt}W</p>}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}