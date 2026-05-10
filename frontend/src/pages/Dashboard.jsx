import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import TripCard from "../components/TripCard";
import Loader from "../components/Loader";
import { formatCurrency } from "../utils/calculateBudget";
import "../css/dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get("/trips");
        setTrips(res.data.trips);
      } catch {
        setError("Failed to load trips");
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const handleDelete = async (tripId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this trip and all its data?",
      )
    )
      return;
    try {
      await api.delete(`/trips/${tripId}`);
      setTrips((prev) => prev.filter((t) => t._id !== tripId));
    } catch {
      alert("Failed to delete trip");
    }
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  const stats = [
    {
      label: "Total Trips",
      value: trips.length,
      icon: "fa-suitcase-rolling",
      color: "blue",
    },
    {
      label: "Planning",
      value: trips.filter((t) => t.status === "planning").length,
      icon: "fa-map",
      color: "yellow",
    },
    {
      label: "Ongoing",
      value: trips.filter((t) => t.status === "ongoing").length,
      icon: "fa-location-crosshairs",
      color: "green",
    },
    {
      label: "Completed",
      value: trips.filter((t) => t.status === "completed").length,
      icon: "fa-circle-check",
      color: "red",
    },
  ];

  const recentTrips = trips.slice(0, 6);

  const recommendedDestinations = [
    {
      city: "Bali",
      country: "Indonesia",
      budget: "₹55k avg",
      icon: "🏝️",
    },
    {
      city: "Dubai",
      country: "UAE",
      budget: "₹85k avg",
      icon: "🏙️",
    },
    {
      city: "Manali",
      country: "India",
      budget: "₹18k avg",
      icon: "🏔️",
    },
    {
      city: "Paris",
      country: "France",
      budget: "₹1.2L avg",
      icon: "🗼",
    },
  ];

  const upcomingTrip = [...trips]
    .filter((t) => new Date(t.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0];

  const estimatedBudget = trips.reduce((sum, t) => {
    return sum + (t.estimatedBudget || 0);
  }, 0);

  const dashboardBudget = formatCurrency(estimatedBudget || 0, "INR");

  return (
    <div>
      {/* Welcome Banner */}
      <div className="dashboard-welcome">
        <h1 className="welcome-title">
          {greeting()}, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="welcome-subtitle">
          {trips.length === 0
            ? "You haven't planned any trips yet. Let's change that!"
            : `You have ${trips.length} trip${trips.length > 1 ? "s" : ""} planned. Ready for your next adventure?`}
        </p>
        <div className="welcome-actions">
          <Link to="/trips/create" className="welcome-btn welcome-btn-primary">
            <i className="fas fa-plus" /> Create New Trip
          </Link>
          <Link to="/trips" className="welcome-btn welcome-btn-outline">
            <i className="fas fa-suitcase-rolling" /> My Trips
          </Link>
        </div>
      </div>

      {/* Upcoming Trip */}
      {upcomingTrip && (
        <div
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)",
            padding: "20px",
            marginBottom: "24px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            className="flex-between"
            style={{ flexWrap: "wrap", gap: "12px" }}
          >
            <div>
              <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                Your Next Adventure
              </p>

              <h2 style={{ fontSize: "22px", fontWeight: "700" }}>
                {upcomingTrip.tripName}
              </h2>

              <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
                {upcomingTrip.destinations?.map((d) => d.city).join(" → ")}
              </p>
            </div>

            <Link
              to={`/trips/${upcomingTrip._id}/itinerary`}
              className="btn btn-primary"
            >
              View Trip
            </Link>
          </div>
        </div>
      )}

      {/* Budget Overview */}
      <div
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-lg)",
          padding: "20px",
          marginBottom: "24px",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="flex-between" style={{ flexWrap: "wrap", gap: "16px" }}>
          <div>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "13px",
                marginBottom: "6px",
              }}
            >
              Planned Budget
            </p>

            <h2
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "var(--primary)",
              }}
            >
              {dashboardBudget}
            </h2>
          </div>

          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "var(--primary-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--primary)",
              fontSize: "28px",
            }}
          >
            <i className="fas fa-wallet" />
          </div>
        </div>
      </div>
      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-icon ${s.color}`}>
              <i className={`fas ${s.icon}`} />
            </div>
            <div className="stat-info">
              <h3>{s.value}</h3>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Trips */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">
            <i
              className="fas fa-clock"
              style={{ color: "var(--primary)", marginRight: "8px" }}
            />
            Recent Trips
          </h2>
          {trips.length > 6 && (
            <Link to="/trips" className="btn btn-secondary btn-sm">
              View All
            </Link>
          )}
        </div>

        {loading && <Loader />}
        {error && (
          <div className="alert alert-error">
            <i className="fas fa-circle-exclamation" /> {error}
          </div>
        )}

        {!loading && !error && recentTrips.length === 0 && (
          <div className="empty-state">
            <i className="fas fa-map-location-dot" />
            <h3>No trips yet</h3>
            <p>Start planning your first adventure and it'll appear here.</p>
            <Link to="/trips/create" className="btn btn-primary">
              <i className="fas fa-plus" /> Create Your First Trip
            </Link>
          </div>
        )}

        {!loading && recentTrips.length > 0 && (
          <div className="trips-grid">
            {recentTrips.map((trip) => (
              <TripCard key={trip._id} trip={trip} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* Recommended Destinations */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">
            <i
              className="fas fa-earth-asia"
              style={{ color: "var(--primary)", marginRight: "8px" }}
            />
            Recommended Destinations
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          {recommendedDestinations.map((d) => (
            <div
              key={d.city}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div style={{ fontSize: "42px" }}>{d.icon}</div>

              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "600" }}>
                  {d.city}
                </h3>

                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                  }}
                >
                  {d.country}
                </p>
              </div>

              <div
                className="badge badge-primary"
                style={{ width: "fit-content" }}
              >
                {d.budget}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      {trips.length > 0 && (
        <div className="dashboard-section">
          <h2 className="section-title" style={{ marginBottom: "16px" }}>
            <i
              className="fas fa-bolt"
              style={{ color: "var(--warning)", marginRight: "8px" }}
            />
            Quick Actions
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "12px",
            }}
          >
            {[
              {
                to: "/activities",
                icon: "fa-compass",
                label: "Browse Activities",
                color: "#2563eb",
              },
              {
                to: "/community",
                icon: "fa-users",
                label: "Community Trips",
                color: "#10b981",
              },
              {
                to: "/profile",
                icon: "fa-user-circle",
                label: "My Profile",
                color: "#f59e0b",
              },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "14px 16px",
                  background: "var(--card-bg)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)",
                  textDecoration: "none",
                  transition: "var(--transition)",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = "var(--shadow-md)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <i
                  className={`fas ${item.icon}`}
                  style={{ color: item.color, width: "18px" }}
                />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
