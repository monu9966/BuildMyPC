import { useState } from "react";

function SelectBox({ title, options, onSelect }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSelect = (item) => {
    setSelected(item);
    onSelect(item);
    setOpen(false);
  };

  return (
    <div className="builder-card">
      <h3 className="select-title">{title}</h3>

      {/* Selected Header */}
      <div className="builder-select" onClick={() => setOpen(!open)}>
        {selected ? selected.name : `Select ${title}`}
      </div>

      {selected && (
        <div className="preview-box">
          <img src={selected.image} alt={selected.name} />
          <h4>{selected.name}</h4>
          <p>₹{selected.price}</p>
        </div>
      )}

      {/* Dropdown Cards */}
      {open && (
        <div className="dropdown-cards">
          {options.map((item) => (
            <div
              key={item._id}
              className={`dropdown-card ${
                selected?._id === item._id ? "selected-card" : ""
              }`}
              onClick={() => handleSelect(item)}
            >
              {/* Image */}
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="dropdown-img"
                />
              )}

              {/* Info */}
              <div className="dropdown-info">
                <h4>{item.name}</h4>
                <p>₹{item.price}</p>

                {item.socket && <p>Socket: {item.socket}</p>}
                {item.ramType && <p>{item.ramType}</p>}
                {item.watt && <p>{item.watt}W</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SelectBox;
