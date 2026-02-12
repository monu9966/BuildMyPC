function SelectBox({ title, options, onSelect }) {
  return (
    <div className="builder-card">
      <h3 className="select-title">{title}</h3>

      <select
        className="builder-select"
        onChange={(e) =>
          onSelect(e.target.value ? JSON.parse(e.target.value) : null)
        }
      >
        <option value="">Select {title}</option>

        {options.map((item) => (
          <option key={item._id} value={JSON.stringify(item)}>
            {item.name} (₹{item.price})
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectBox;
