import { Link, useNavigate } from "react-router-dom";
import "../css/global.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "70vh", // Reduced to fit better in layouts
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "16px",
        fontFamily: "Poppins, sans-serif",
        textAlign: "center",
        padding: "40px 20px",
      }}
    >
      <div style={{ fontSize: "80px", marginBottom: "10px" }}>✈️</div>
      <h1
        style={{
          fontSize: "72px",
          fontWeight: "700",
          color: "var(--primary)",
          lineHeight: 1,
          opacity: 0.1,
          position: "absolute",
          zIndex: -1,
        }}
      >
        404
      </h1>
      <h2 style={{ fontSize: "24px", fontWeight: "700", color: "var(--text-primary)" }}>
        Destination Not Found
      </h2>
      <p style={{ color: "var(--text-secondary)", maxWidth: "400px", fontSize: "15px" }}>
        Looks like this part of the world isn't on our map yet. Let's get you back on track!
      </p>
      
      <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-secondary"
        >
          <i className="fas fa-arrow-left" /> Go Back
        </button>
        <Link
          to="/dashboard"
          className="btn btn-primary"
        >
          <i className="fas fa-house" /> Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
