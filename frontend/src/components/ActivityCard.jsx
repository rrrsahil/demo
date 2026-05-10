import { CATEGORY_ICONS, API_BASE } from "../utils/constants";
import { formatCurrency } from "../utils/calculateBudget";
import "../css/activityCard.css";

const ActivityCard = ({
  activity,
  onAdd,
  selected = false,
}) => {
  return (
    <div
      className={`activity-card ${
        selected ? "selected" : ""
      }`}
    >
      {/* =====================
          IMAGE
      ===================== */}
      <div className="activity-image-wrap">
        {activity.image ? (
          <img
            src={`${API_BASE}${activity.image}`}
            alt={activity.activityName}
            className="activity-image"
          />
        ) : (
          <div className="activity-image-placeholder">
            {CATEGORY_ICONS[
              activity.category
            ] || "📌"}
          </div>
        )}
      </div>

      {/* =====================
          CONTENT
      ===================== */}
      <div className="activity-card-content">

        {/* HEADER */}
        <div className="activity-card-header">

          <span className="activity-category-badge">
            {activity.category}
          </span>

          <span className="activity-rating">
            <i
              className="fas fa-star"
              style={{ color: "#f59e0b" }}
            />
            {activity.rating?.toFixed(1)}
          </span>
        </div>

        {/* TITLE */}
        <h4 className="activity-name">
          {activity.activityName}
        </h4>

        {/* DESCRIPTION */}
        {activity.description && (
          <p className="activity-desc">
            {activity.description}
          </p>
        )}

        {/* META */}
        <div className="activity-meta">

          <span>
            <i className="fas fa-clock" />
            {activity.duration}
          </span>

          <span>
            <i className="fas fa-wallet" />
            {activity.cost === 0
              ? "Free"
              : formatCurrency(activity.cost)}
          </span>
        </div>

        {/* BUTTON */}
        {onAdd && (
          <button
            className={`btn btn-sm btn-full ${
              selected
                ? "btn-success"
                : "btn-primary"
            }`}
            onClick={() => onAdd(activity)}
          >
            {selected ? (
              <>
                <i className="fas fa-check" />
                Added
              </>
            ) : (
              <>
                <i className="fas fa-plus" />
                Add Activity
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;