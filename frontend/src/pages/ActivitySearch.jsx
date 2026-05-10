import { useState, useEffect } from "react";
import api from "../api/api";
import ActivityCard from "../components/ActivityCard";
import Loader from "../components/Loader";
import { ACTIVITY_CATEGORIES } from "../utils/constants";

const ActivitySearch = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [costFilter, setCostFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");

  const [selectedActivities, setSelectedActivities] = useState([]);

  useEffect(() => {
    api
      .get("/activities")
      .then((res) => setActivities(res.data.activities))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* =========================
     ADD / REMOVE ACTIVITY
  ========================= */
  const toggleActivity = (activity) => {
    const exists = selectedActivities.find(
      (a) => a._id === activity._id
    );

    if (exists) {
      setSelectedActivities((prev) =>
        prev.filter((a) => a._id !== activity._id)
      );
    } else {
      setSelectedActivities((prev) => [...prev, activity]);
    }
  };

  /* =========================
     FILTER LOGIC
  ========================= */
  const filtered = activities.filter((a) => {
    const matchSearch =
      a.activityName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      a.description
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchCat =
      category === "All" ||
      a.category === category;

    let matchCost = true;

    if (costFilter === "free") {
      matchCost = a.cost === 0;
    }

    if (costFilter === "paid") {
      matchCost = a.cost > 0;
    }

    let matchDuration = true;

    if (durationFilter === "short") {
      matchDuration =
        a.duration?.includes("1") ||
        a.duration?.includes("2");
    }

    if (durationFilter === "long") {
      matchDuration =
        a.duration?.includes("3") ||
        a.duration?.includes("4") ||
        a.duration?.includes("Full");
    }

    return (
      matchSearch &&
      matchCat &&
      matchCost &&
      matchDuration
    );
  });

  return (
    <div>
      {/* =========================
          HEADER
      ========================= */}
      <div style={{ marginBottom: "24px" }}>
        <h1 className="page-title">
          <i
            className="fas fa-compass"
            style={{
              color: "var(--primary)",
              marginRight: "10px",
            }}
          />
          Activity Explorer
        </h1>

        <p className="page-subtitle">
          Discover activities to add to your trips
        </p>
      </div>

      {/* =========================
          TOP FILTER BAR
      ========================= */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "18px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Search */}
        <div
          className="input-icon-wrap"
          style={{
            flex: 1,
            minWidth: "220px",
            maxWidth: "420px",
          }}
        >
          <i className="fas fa-magnifying-glass input-icon" />

          <input
            type="text"
            className="form-input"
            placeholder="Search activities..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        {/* Cost Filter */}
        <select
          className="form-select"
          value={costFilter}
          onChange={(e) =>
            setCostFilter(e.target.value)
          }
          style={{ minWidth: "150px" }}
        >
          <option value="all">
            All Costs
          </option>

          <option value="free">
            Free
          </option>

          <option value="paid">
            Paid
          </option>
        </select>

        {/* Duration Filter */}
        <select
          className="form-select"
          value={durationFilter}
          onChange={(e) =>
            setDurationFilter(e.target.value)
          }
          style={{ minWidth: "160px" }}
        >
          <option value="all">
            All Duration
          </option>

          <option value="short">
            Short Duration
          </option>

          <option value="long">
            Long Duration
          </option>
        </select>
      </div>

      {/* =========================
          CATEGORY BUTTONS
      ========================= */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "22px",
        }}
      >
        {ACTIVITY_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`btn btn-sm ${
              category === c
                ? "btn-primary"
                : "btn-secondary"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* =========================
          SELECTED BAR
      ========================= */}
      {selectedActivities.length > 0 && (
        <div className="activity-selected-bar">
          <i className="fas fa-check-circle" />

          <span>
            {selectedActivities.length}{" "}
            activities selected
          </span>
        </div>
      )}

      {/* =========================
          LOADER
      ========================= */}
      {loading && <Loader />}

      {/* =========================
          EMPTY STATE
      ========================= */}
      {!loading && filtered.length === 0 && (
        <div className="empty-state">
          <i className="fas fa-compass" />

          <h3>No activities found</h3>

          <p>
            Try another search or filter
          </p>
        </div>
      )}

      {/* =========================
          ACTIVITY GRID
      ========================= */}
      {!loading && filtered.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "18px",
          }}
        >
          {filtered.map((act) => (
            <ActivityCard
              key={act._id}
              activity={act}
              onAdd={toggleActivity}
              selected={selectedActivities.find(
                (a) => a._id === act._id
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivitySearch;