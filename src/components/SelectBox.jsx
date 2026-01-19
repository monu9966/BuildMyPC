function SelectBox({title, options, onSelect }) {
    return (
        <div className="card">
            <h4>{title}</h4>
            <select onChange={(e) => onSelect(JSON.parse(e.target.value))}>
                <option value="">Select {title}</option>
                {options.map((item) => (
                    <option key={item.id} value={JSON.stringify(item)}>
                        {item.name} (₹{item.price})
                    </option>
                ))}
            </select>
        </div>
    );
}

const boxStyle = {
    marginBottom: "20px",
};

export default SelectBox;