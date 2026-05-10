import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";
import ActivityCard from "../components/ActivityCard";
import Loader from "../components/Loader";
import { formatDate } from "../utils/formatDate";
import { formatCurrency } from "../utils/calculateBudget";
import { ACTIVITY_CATEGORIES } from "../utils/constants";
import "../css/itineraryBuilder.css";

const ItineraryBuilder = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [itinerary, setItinerary] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [expandedDay, setExpandedDay] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalDayId, setModalDayId] = useState(null);
  const [actSearch, setActSearch] = useState("");
  const [actCategory, setActCategory] = useState("All");
  const [draggedIdx, setDraggedIdx] = useState(null);

  const [dayForm, setDayForm] = useState({
    day: "",
    city: "",
    date: "",
    notes: "",
  });
  const [dayErrors, setDayErrors] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const [tripRes, itinRes, actRes] = await Promise.all([
          api.get(`/trips/${tripId}`),
          api.get(`/itinerary/${tripId}`),
          api.get("/activities"),
        ]);
        setTrip(tripRes.data.trip);
        setItinerary(itinRes.data.itinerary);
        setActivities(actRes.data.activities);
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tripId]);

  const validateDay = () => {
    const errs = {};
    if (!dayForm.day || dayForm.day < 1) errs.day = "Day number is required";
    if (!dayForm.city.trim()) errs.city = "City name is required";
    if (itinerary.find((d) => d.day === Number(dayForm.day)))
      errs.day = `Day ${dayForm.day} already exists`;
    setDayErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const addDay = async (e) => {
    e.preventDefault();
    if (!validateDay()) return;
    setSaving(true);
    try {
      const res = await api.post("/itinerary/add", {
        tripId,
        day: Number(dayForm.day),
        city: dayForm.city,
        date: dayForm.date,
        notes: dayForm.notes,
      });
      setItinerary((p) =>
        [...p, res.data.itinerary].sort((a, b) => a.day - b.day),
      );
      setDayForm({ day: "", city: "", date: "", notes: "" });
      setExpandedDay(res.data.itinerary._id);
    } catch (err) {
      setDayErrors({ day: err.response?.data?.message || "Failed to add day" });
    } finally {
      setSaving(false);
    }
  };

  const deleteDay = async (id) => {
    if (!window.confirm("Remove this day from itinerary?")) return;
    try {
      await api.delete(`/itinerary/${id}`);
      setItinerary((p) => p.filter((d) => d._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  const openActivityModal = (dayId) => {
    setModalDayId(dayId);
    setShowModal(true);
    setActSearch("");
    setActCategory("All");
  };

  const addActivityToDay = async (activity) => {
    const dayDoc = itinerary.find((d) => d._id === modalDayId);
    if (!dayDoc) return;
    const alreadyAdded = dayDoc.activities.some(
      (a) => a.activityName === activity.activityName,
    );
    if (alreadyAdded) return;

    const updatedActivities = [
      ...dayDoc.activities,
      {
        activityId: activity._id,
        activityName: activity.activityName,
        category: activity.category,
        cost: activity.cost,
        duration: activity.duration,
      },
    ];
    try {
      const res = await api.put(`/itinerary/${modalDayId}`, {
        activities: updatedActivities,
      });
      setItinerary((p) =>
        p.map((d) => (d._id === modalDayId ? res.data.itinerary : d)),
      );
    } catch {
      alert("Failed to add activity");
    }
  };

  const removeActivity = async (dayId, actIndex) => {
    const dayDoc = itinerary.find((d) => d._id === dayId);
    const updatedActivities = dayDoc.activities.filter(
      (_, i) => i !== actIndex,
    );
    try {
      const res = await api.put(`/itinerary/${dayId}`, {
        activities: updatedActivities,
      });
      setItinerary((p) =>
        p.map((d) => (d._id === dayId ? res.data.itinerary : d)),
      );
    } catch {
      alert("Failed to remove activity");
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = async (e, targetIndex) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIndex) return;

    const newItin = [...itinerary];
    const [draggedItem] = newItin.splice(draggedIdx, 1);
    newItin.splice(targetIndex, 0, draggedItem);

    // Recalculate day numbers
    const updatedItin = newItin.map((item, idx) => ({
      ...item,
      day: idx + 1
    }));

    setItinerary(updatedItin);
    setDraggedIdx(null);

    // Call API
    try {
      await api.put(`/itinerary/reorder/${tripId}`, {
        orderedDays: updatedItin.map(d => ({ id: d._id, day: d.day }))
      });
    } catch(err) {
      console.log(err)
      alert("Failed to save new order");
    }
  };

  const filteredActivities = activities.filter((a) => {
    const matchSearch = a.activityName
      .toLowerCase()
      .includes(actSearch.toLowerCase());
    const matchCat = actCategory === "All" || a.category === actCategory;
    return matchSearch && matchCat;
  });

  const currentDayActivities =
    itinerary
      .find((d) => d._id === modalDayId)
      ?.activities?.map((a) => a.activityName) || [];

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="alert alert-error">
        <i className="fas fa-circle-exclamation" /> {error}
      </div>
    );

  return (
    <div>
      {/* Header */}
      <div
        className="flex-between"
        style={{ marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}
      >
        <div>
          <h1 className="page-title">
            <i
              className="fas fa-map"
              style={{ color: "var(--primary)", marginRight: "10px" }}
            />
            Itinerary Builder
          </h1>
          <p className="page-subtitle">Build your day-by-day travel plan</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            to={`/trips/${tripId}/itinerary/view`}
            className="btn btn-secondary btn-sm"
          >
            <i className="fas fa-eye" /> View Itinerary
          </Link>
          <Link
            to={`/trips/${tripId}/budget`}
            className="btn btn-primary btn-sm"
          >
            <i className="fas fa-wallet" /> Budget
          </Link>
        </div>
      </div>

      <div className="itinerary-layout">
        {/* Left: Trip Info + Add Day Form */}
        <div>
          {trip && (
            <div
              className="itinerary-trip-info"
              style={{ marginBottom: "16px" }}
            >
              <h2 className="itinerary-trip-name">{trip.tripName}</h2>
              <div className="itinerary-trip-meta">
                <span>
                  <i className="fas fa-calendar-days" />
                  {formatDate(trip.startDate)}
                </span>
                <span>
                  <i className="fas fa-arrow-right" />
                  {formatDate(trip.endDate)}
                </span>
                {trip.destinations?.length > 0 && (
                  <span>
                    <i className="fas fa-location-dot" />
                    {trip.destinations.map((d) => d.city).join(", ")}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Add Day Form */}
          <div className="day-form-card">
            <h3 className="day-form-title">
              <i
                className="fas fa-plus"
                style={{ color: "var(--primary)", marginRight: "8px" }}
              />
              Add Day
            </h3>
            <form onSubmit={addDay}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Day #</label>
                  <input
                    type="number"
                    id="day-num"
                    className="form-input"
                    placeholder="1"
                    min="1"
                    value={dayForm.day}
                    onChange={(e) => {
                      setDayForm((p) => ({ ...p, day: e.target.value }));
                      setDayErrors({});
                    }}
                  />
                  {dayErrors.day && (
                    <span className="form-error">{dayErrors.day}</span>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    id="day-city"
                    className="form-input"
                    placeholder="e.g., Mumbai"
                    value={dayForm.city}
                    onChange={(e) => {
                      setDayForm((p) => ({ ...p, city: e.target.value }));
                      setDayErrors({});
                    }}
                  />
                  {dayErrors.city && (
                    <span className="form-error">{dayErrors.city}</span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Date (optional)</label>
                <input
                  type="date"
                  id="day-date"
                  className="form-input"
                  value={dayForm.date}
                  onChange={(e) =>
                    setDayForm((p) => ({ ...p, date: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Notes (optional)</label>
                <textarea
                  className="form-textarea"
                  id="day-notes"
                  rows={2}
                  placeholder="Any special notes for this day..."
                  value={dayForm.notes}
                  onChange={(e) =>
                    setDayForm((p) => ({ ...p, notes: e.target.value }))
                  }
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin" /> Adding...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus" /> Add Day
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Days List */}
        <div>
          {itinerary.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-calendar-plus" />
              <h3>No days added yet</h3>
              <p>Use the form on the left to add your first day.</p>
            </div>
          ) : (
            <div className="days-list">
              {itinerary.map((day, index) => (
                <div 
                  className="day-card" 
                  key={day._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={() => setDraggedIdx(null)}
                  style={{ 
                    opacity: draggedIdx === index ? 0.4 : 1,
                    cursor: 'grab',
                    transition: 'opacity 0.2s'
                  }}
                >
                  <div
                    className="day-card-header"
                    onClick={() =>
                      setExpandedDay(expandedDay === day._id ? null : day._id)
                    }
                  >
                    <div className="day-card-title">
                      <div className="day-badge" style={{ cursor: 'grab' }} title="Drag to reorder">
                        <i className="fas fa-grip-vertical" style={{ fontSize: '10px', marginRight: '4px', opacity: 0.6 }} />
                        D{day.day}
                      </div>
                      <div>
                        <p className="day-city-name">{day.city}</p>
                        <p className="day-activity-count">
                          {day.date ? `${formatDate(day.date)} • ` : ""}
                          {day.activities.length} activit
                          {day.activities.length !== 1 ? "ies" : "y"}
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openActivityModal(day._id);
                        }}
                      >
                        <i className="fas fa-plus" /> Activities
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDay(day._id);
                        }}
                        style={{ color: "var(--danger)" }}
                      >
                        <i className="fas fa-trash" />
                      </button>
                      <i
                        className={`fas fa-chevron-${expandedDay === day._id ? "up" : "down"}`}
                        style={{ color: "var(--text-muted)", fontSize: "12px" }}
                      />
                    </div>
                  </div>

                  {expandedDay === day._id && (
                    <div className="day-card-body">
                      {day.activities.length === 0 ? (
                        <p
                          style={{
                            fontSize: "13px",
                            color: "var(--text-muted)",
                            textAlign: "center",
                            padding: "12px 0",
                          }}
                        >
                          No activities yet. Click "+ Activities" to add some.
                        </p>
                      ) : (
                        day.activities.map((act, i) => (
                          <div className="activity-chip" key={i}>
                            <span style={{ fontSize: "16px" }}>
                              {act.category === "Adventure"
                                ? "🧗"
                                : act.category === "Food"
                                  ? "🍜"
                                  : act.category === "Culture"
                                    ? "🏛️"
                                    : act.category === "Nature"
                                      ? "🌿"
                                      : "📌"}
                            </span>
                            <span className="activity-chip-name">
                              {act.activityName}
                            </span>
                            <span className="activity-chip-cost">
                              {act.cost === 0
                                ? "Free"
                                : formatCurrency(act.cost)}
                            </span>
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => removeActivity(day._id, i)}
                              style={{ color: "var(--danger)", padding: "4px" }}
                            >
                              <i className="fas fa-xmark" />
                            </button>
                          </div>
                        ))
                      )}
                      {day.notes && (
                        <div
                          style={{
                            marginTop: "10px",
                            fontSize: "13px",
                            color: "var(--text-secondary)",
                            padding: "10px",
                            background: "var(--secondary-bg)",
                            borderRadius: "var(--radius-sm)",
                          }}
                        >
                          <i
                            className="fas fa-note-sticky"
                            style={{ marginRight: "6px" }}
                          />{" "}
                          {day.notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Activity Selection Modal */}
      {showModal && (
        <div
          className="activity-search-modal"
          onClick={() => setShowModal(false)}
        >
          <div
            className="activity-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="activity-modal-header">
              <h3 style={{ fontSize: "16px", fontWeight: "600" }}>
                Add Activities
              </h3>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowModal(false)}
              >
                <i className="fas fa-xmark" />
              </button>
            </div>
            <div
              style={{
                padding: "12px 24px",
                borderBottom: "1px solid var(--border-color)",
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <div
                className="input-icon-wrap"
                style={{ flex: 1, minWidth: "180px" }}
              >
                <i className="fas fa-magnifying-glass input-icon" />
                <input
                  type="text"
                  id="act-search"
                  className="form-input"
                  placeholder="Search activities..."
                  value={actSearch}
                  onChange={(e) => setActSearch(e.target.value)}
                />
              </div>
              <select
                id="act-category"
                className="form-select"
                style={{ width: "auto" }}
                value={actCategory}
                onChange={(e) => setActCategory(e.target.value)}
              >
                {ACTIVITY_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="activity-modal-body">
              {filteredActivities.length === 0 ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "var(--text-muted)",
                    padding: "32px 0",
                  }}
                >
                  No activities found
                </p>
              ) : (
                <div className="activity-grid">
                  {filteredActivities.map((act) => (
                    <ActivityCard
                      key={act._id}
                      activity={act}
                      selected={currentDayActivities.includes(act.activityName)}
                      onAdd={addActivityToDay}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryBuilder;
