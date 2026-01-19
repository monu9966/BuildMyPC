function UsageCard({ title, description, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        border: selected ? "2px solid #0d6efd" : "2px solid #ddd",
        borderRadius: "10px",
        padding: "20px",
        cursor: "pointer",
        background: selected ? "#eef4ff" : "#fff",
        flex: 1,
      }}
    >
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default UsageCard;
