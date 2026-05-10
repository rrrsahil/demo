import { Link } from "react-router-dom";
import { formatDate, getDuration } from "../utils/formatDate";
import { API_BASE } from "../utils/constants";
import "../css/tripCard.css";

const statusColors = {
  planning: { bg: "#eff6ff", color: "#2563eb" },
  ongoing: { bg: "#ecfdf5", color: "#10b981" },
  completed: { bg: "#f8fafc", color: "#64748b" },
};

const TripCard = ({ trip, onDelete }) => {
  const duration = getDuration(trip.startDate, trip.endDate);
  const status = statusColors[trip.status] || statusColors.planning;

  return (
    <div className="trip-card">
      {/* Cover Image */}
      <div className="trip-card-img">
        {trip.coverImage ? (
          <img src={`${API_BASE}${trip.coverImage}`} alt={trip.tripName} />
        ) : (
          <div className="trip-card-img-placeholder">
            <i className="fas fa-map-location-dot" />
          </div>
        )}
        <span
          className="trip-card-status"
          style={{ background: status.bg, color: status.color }}
        >
          {trip.status}
        </span>
      </div>

      {/* Content */}
      <div className="trip-card-body">
        <h3 className="trip-card-title">{trip.tripName}</h3>
        {trip.description && (
          <p className="trip-card-desc">{trip.description}</p>
        )}

        {/* Destinations */}
        {trip.destinations?.length > 0 && (
          <div className="trip-card-destinations">
            <i
              className="fas fa-location-dot"
              style={{ color: "var(--primary)", fontSize: "12px" }}
            />
            <span>{trip.destinations.map((d) => d.city).join(" → ")}</span>
          </div>
        )}

        {/* Meta */}
        <div className="trip-card-meta">
          <div className="trip-meta-item">
            <i className="fas fa-calendar-days" />
            <span>{formatDate(trip.startDate)}</span>
          </div>
          <div className="trip-meta-item">
            <i className="fas fa-clock" />
            <span>
              {duration} day{duration !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="trip-card-actions">
          <Link
            to={`/trips/${trip._id}/itinerary`}
            className="btn btn-primary btn-sm"
          >
            <i className="fas fa-map" /> Itinerary
          </Link>
          <Link
            to={`/trips/${trip._id}/budget`}
            className="btn btn-secondary btn-sm"
          >
            <i className="fas fa-wallet" /> Budget
          </Link>
          {onDelete && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onDelete(trip._id)}
              title="Delete trip"
              style={{ color: "var(--danger)" }}
            >
              <i className="fas fa-trash" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripCard;
