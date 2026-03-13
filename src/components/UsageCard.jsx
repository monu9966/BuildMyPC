
function UsageCard({ title, icon, description, selected, onClick }) {
  return (
    <div
      className={`usage-card ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      {icon && <div className="usage-icon">{icon}</div>}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default UsageCard;
