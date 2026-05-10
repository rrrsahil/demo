import { CATEGORY_ICONS } from "../utils/constants";
import { formatCurrency } from "../utils/calculateBudget";
import "../css/activityCard.css";

const ActivityCard = ({ activity, onAdd, selected = false }) => {
  return (
    <div className={`activity-card ${selected ? "selected" : ""}`}>
      <div className="activity-card-header">
        <span className="activity-emoji">
          {CATEGORY_ICONS[activity.category] || "📌"}
        </span>
        <span className="activity-category-badge">{activity.category}</span>
      </div>
      <h4 className="activity-name">{activity.activityName}</h4>
      {activity.description && (
        <p className="activity-desc">{activity.description}</p>
      )}
      <div className="activity-meta">
        <span>
          <i className="fas fa-clock" /> {activity.duration}
        </span>
        <span>
          <i className="fas fa-star" style={{ color: "#f59e0b" }} />{" "}
          {activity.rating?.toFixed(1)}
        </span>
      </div>
      <div className="activity-footer">
        <span className="activity-cost">
          {activity.cost === 0 ? "Free" : formatCurrency(activity.cost)}
        </span>
        {onAdd && (
          <button
            className={`btn btn-sm ${selected ? "btn-success" : "btn-primary"}`}
            onClick={() => onAdd(activity)}
          >
            {selected ? (
              <>
                <i className="fas fa-check" /> Added
              </>
            ) : (
              <>
                <i className="fas fa-plus" /> Add
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;
