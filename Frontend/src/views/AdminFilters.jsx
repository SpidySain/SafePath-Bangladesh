import { useMemo } from "react";
import locations from "../data/bdLocations.json";
import { SEVERITY_LEVELS } from "../utils/reportFilters";
import "./adminFilters.css";

const statusOptions = [
  { value: "", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "VERIFIED", label: "Verified" },
  { value: "FALSE", label: "False" }
];

export default function AdminFilters({
  categories,
  value,
  onChange,
  onApply,
  onReset,
  applying
}) {
  const districtOptions = useMemo(() => locations.map(loc => loc.district), []);
  const upazilaOptions = useMemo(() => {
    const match = locations.find(loc => loc.district === value.district);
    return match ? match.upazilas : [];
  }, [value.district]);

  const update = (field, v) => {
    if (field === "district") return onChange({ ...value, district: v, upazila: "" });
    onChange({ ...value, [field]: v });
  };

  return (
    <div className="admin-filters">
      <div className="filters__row">
        <div className="filters__field">
          <label>District</label>
          <select value={value.district} onChange={e => update("district", e.target.value)}>
            <option value="">All districts</option>
            {districtOptions.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div className="filters__field">
          <label>Upazila</label>
          <select
            value={value.upazila}
            onChange={e => update("upazila", e.target.value)}
            disabled={!value.district}
          >
            <option value="">{value.district ? "All upazilas" : "Choose district first"}</option>
            {upazilaOptions.map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
        <div className="filters__field">
          <label>Severity</label>
          <select value={value.severityLevel} onChange={e => update("severityLevel", e.target.value)}>
            {SEVERITY_LEVELS.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>
        </div>
        <div className="filters__field">
          <label>Issue category</label>
          <select value={value.categoryId} onChange={e => update("categoryId", e.target.value)}>
            <option value="">All categories</option>
            {categories.map(cat => (
              <option key={cat.id || cat.name} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="filters__field">
          <label>Status</label>
          <select value={value.status} onChange={e => update("status", e.target.value)}>
            {statusOptions.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="filters__field">
          <label>Sort by</label>
          <select value={value.sort || "createdAt"} onChange={e => update("sort", e.target.value)}>
            <option value="createdAt">Newest first</option>
            <option value="severity">Severity</option>
          </select>
        </div>
      </div>

      <div className="filters__actions">
        <div className="filters__buttons">
          <button type="button" onClick={() => onApply(value)} disabled={applying}>
            {applying ? "Filtering..." : "Apply filters"}
          </button>
          <button type="button" className="secondary" onClick={onReset} disabled={applying}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
