import { useEffect, useState } from "react";
import { fetchActiveAwareness } from "../controllers/awarenessController";
import "./awarenessBanner.css";

export default function AwarenessBanner() {
  const [messages, setMessages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await fetchActiveAwareness();
        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load awareness messages:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, []);

  if (loading || messages.length === 0) {
    return null;
  }

  const currentMessage = messages[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % messages.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "awareness-banner--high";
      case "MEDIUM":
        return "awareness-banner--medium";
      case "LOW":
        return "awareness-banner--low";
      default:
        return "awareness-banner--medium";
    }
  };

  return (
    <div className={`awareness-banner ${getPriorityColor(currentMessage.priority)}`}>
      <div className="awareness-banner__content">
        <div className="awareness-banner__header">
          <span className="awareness-banner__badge">{currentMessage.category}</span>
          <h3 className="awareness-banner__title">{currentMessage.title}</h3>
        </div>
        <p className="awareness-banner__message">{currentMessage.message}</p>
        {currentMessage.description && (
          <p className="awareness-banner__description">{currentMessage.description}</p>
        )}
      </div>

      {messages.length > 1 && (
        <div className="awareness-banner__controls">
          <button
            className="awareness-banner__btn awareness-banner__btn--prev"
            onClick={handlePrevious}
            aria-label="Previous message"
          >
            ❮
          </button>
          <span className="awareness-banner__counter">
            {currentIndex + 1} / {messages.length}
          </span>
          <button
            className="awareness-banner__btn awareness-banner__btn--next"
            onClick={handleNext}
            aria-label="Next message"
          >
            ❯
          </button>
        </div>
      )}
    </div>
  );
}
