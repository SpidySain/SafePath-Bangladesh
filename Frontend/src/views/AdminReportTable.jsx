import "./adminReportTable.css";

const statusOptions = ["PENDING", "VERIFIED", "FALSE"];

export default function AdminReportTable({ reports = [], onChangeStatus, sorting }) {
  const sorted = [...reports].sort((a, b) => {
    if (sorting === "severity") return (b.severity || 0) - (a.severity || 0);
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  if (!sorted.length) return <p className="muted">No reports match these filters.</p>;

  return (
    <div className="admin-table">
      <div className="admin-table__head">
        <span>Location</span>
        <span>Issue</span>
        <span>Severity</span>
        <span>Status</span>
        <span>Submitted</span>
        <span>Actions</span>
      </div>
      {sorted.map(report => (
        <div className="admin-table__row" key={report.id}>
          <div>
            <div>{report.location?.upazila ? `${report.location.upazila}, ` : ""}{report.location?.district || report.city}</div>
            <div className="muted">{report.location?.address || "No address"}</div>
          </div>
          <div>
            <div>{report.issueCategory?.name || "Unknown"}</div>
            <div className="muted">Reporter: {report.reporterId || "N/A"}</div>
          </div>
          <div>
            <span className="pill">Severity {report.severity}</span>
          </div>
          <div>
            <span className="pill">{report.status}</span>
          </div>
          <div className="muted">{new Date(report.createdAt).toLocaleString()}</div>
          <div className="admin-table__actions">
            {statusOptions.map(s => (
              <button
                key={s}
                className={s === "VERIFIED" ? "" : "secondary"}
                onClick={() => onChangeStatus(report.id, s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
