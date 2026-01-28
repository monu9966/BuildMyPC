
function UsageCard({ title, description, selected, onClick }) {
  return (
    <div
      className={`usage-card ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default UsageCard;
