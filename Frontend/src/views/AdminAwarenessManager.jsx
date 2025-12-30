import { useEffect, useState } from "react";
import {
  adminFetchAwareness,
  adminCreateAwareness,
  adminUpdateAwareness,
  adminDeleteAwareness,
  adminToggleAwareness
} from "../controllers/awarenessController";
import "./adminAwarenessManager.css";

export default function AdminAwarenessManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    description: "",
    category: "SAFETY",
    priority: "MEDIUM",
    expiresAt: ""
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await adminFetchAwareness();
      setMessages(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError("Failed to load awareness messages");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.message) {
      setError("Title and message are required");
      return;
    }

    try {
      if (editingId) {
        await adminUpdateAwareness(editingId, formData);
      } else {
        await adminCreateAwareness(formData);
      }

      // Reset form and reload
      setFormData({
        title: "",
        message: "",
        description: "",
        category: "SAFETY",
        priority: "MEDIUM",
        expiresAt: ""
      });
      setEditingId(null);
      setShowForm(false);
      await loadMessages();
    } catch (err) {
      setError(err.message || "Failed to save awareness message");
    }
  };

  const handleEdit = (message) => {
    setFormData({
      title: message.title,
      message: message.message,
      description: message.description || "",
      category: message.category,
      priority: message.priority,
      expiresAt: message.expiresAt ? new Date(message.expiresAt).toISOString().slice(0, 16) : ""
    });
    setEditingId(message._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await adminDeleteAwareness(id);
        await loadMessages();
      } catch (err) {
        setError("Failed to delete message");
      }
    }
  };

  const handleToggle = async (id) => {
    try {
      await adminToggleAwareness(id);
      await loadMessages();
    } catch (err) {
      setError("Failed to toggle message status");
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      message: "",
      description: "",
      category: "SAFETY",
      priority: "MEDIUM",
      expiresAt: ""
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "awareness-msg--high";
      case "MEDIUM":
        return "awareness-msg--medium";
      case "LOW":
        return "awareness-msg--low";
      default:
        return "";
    }
  };

  return (
    <div className="awareness-manager">
      <div className="awareness-manager__header">
        <h2>Manage Awareness Messages</h2>
        <button
          className="awareness-manager__btn-add"
          onClick={() => {
            if (showForm && !editingId) {
              setShowForm(false);
            } else {
              setShowForm(true);
              setEditingId(null);
              setFormData({
                title: "",
                message: "",
                description: "",
                category: "SAFETY",
                priority: "MEDIUM",
                expiresAt: ""
              });
            }
          }}
        >
          {showForm ? "Cancel" : "+ New Message"}
        </button>
      </div>

      {error && <div className="awareness-manager__error">{error}</div>}

      {showForm && (
        <form className="awareness-form" onSubmit={handleSubmit}>
          <div className="awareness-form__group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Heavy Traffic Alert"
              required
            />
          </div>

          <div className="awareness-form__group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Enter the awareness message"
              rows="3"
              required
            />
          </div>

          <div className="awareness-form__group">
            <label htmlFor="description">Description (optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Additional details"
              rows="2"
            />
          </div>

          <div className="awareness-form__row">
            <div className="awareness-form__group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="SAFETY">Safety</option>
                <option value="TIPS">Tips</option>
                <option value="EDUCATION">Education</option>
                <option value="ANNOUNCEMENT">Announcement</option>
              </select>
            </div>

            <div className="awareness-form__group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div className="awareness-form__group">
            <label htmlFor="expiresAt">Expires At (optional)</label>
            <input
              id="expiresAt"
              type="datetime-local"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleInputChange}
            />
          </div>

          <div className="awareness-form__actions">
            <button type="submit" className="awareness-form__btn-submit">
              {editingId ? "Update Message" : "Create Message"}
            </button>
            <button
              type="button"
              className="awareness-form__btn-cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="awareness-manager__loading">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="awareness-manager__empty">No awareness messages yet. Create one to get started!</div>
      ) : (
        <div className="awareness-messages">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`awareness-msg ${getPriorityColor(msg.priority)} ${
                !msg.isActive ? "awareness-msg--inactive" : ""
              }`}
            >
              <div className="awareness-msg__content">
                <div className="awareness-msg__header">
                  <h3 className="awareness-msg__title">{msg.title}</h3>
                  <span className={`awareness-msg__badge awareness-msg__badge--${msg.priority.toLowerCase()}`}>
                    {msg.priority}
                  </span>
                </div>
                <p className="awareness-msg__text">{msg.message}</p>
                {msg.description && (
                  <p className="awareness-msg__description">{msg.description}</p>
                )}
                <div className="awareness-msg__meta">
                  <span className="awareness-msg__category">{msg.category}</span>
                  {msg.expiresAt && (
                    <span className="awareness-msg__expires">
                      Expires: {new Date(msg.expiresAt).toLocaleString()}
                    </span>
                  )}
                  <span className="awareness-msg__created">
                    Created: {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="awareness-msg__actions">
                <button
                  className={`awareness-msg__btn awareness-msg__btn--toggle ${
                    !msg.isActive ? "awareness-msg__btn--toggle-on" : "awareness-msg__btn--toggle-off"
                  }`}
                  onClick={() => handleToggle(msg._id)}
                  title={msg.isActive ? "Deactivate" : "Activate"}
                >
                  {msg.isActive ? "Active" : "Inactive"}
                </button>
                <button
                  className="awareness-msg__btn awareness-msg__btn--edit"
                  onClick={() => handleEdit(msg)}
                >
                  Edit
                </button>
                <button
                  className="awareness-msg__btn awareness-msg__btn--delete"
                  onClick={() => handleDelete(msg._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
