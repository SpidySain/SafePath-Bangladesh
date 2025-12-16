export default function CategoryList({ categories }) {
  return (
    <ul className="list">
      {categories.map(cat => (
        <li className="list__item" key={cat.id || cat.name}>
          <div>
            <div>{cat.name}</div>
            <div className="muted">{cat.description || "No description provided."}</div>
          </div>
        </li>
      ))}
      {categories.length === 0 && (
        <p className="muted">No categories loaded. Point `VITE_API_BASE_URL` to your backend and refresh.</p>
      )}
    </ul>
  );
}
