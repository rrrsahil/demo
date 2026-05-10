import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";
import ChecklistItem from "../components/ChecklistItem";
import Loader from "../components/Loader";
import { CHECKLIST_CATEGORIES } from "../utils/constants";

const PackingChecklist = () => {
  const { tripId } = useParams();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newItem, setNewItem] = useState("");
  const [newCategory, setNewCategory] = useState("Other");

  const [adding, setAdding] = useState(false);

  const [filter, setFilter] = useState("All");

  const [trip, setTrip] = useState(null);

  const [error, setError] = useState("");

  // =========================
  // Load Data
  // =========================
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [tripRes, listRes] = await Promise.all([
          api.get(`/trips/${tripId}`),
          api.get(`/checklist/${tripId}`),
        ]);

        setTrip(tripRes.data.trip);

        setItems(listRes.data.items || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load checklist data",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [tripId]);

  // =========================
  // Add Item
  // =========================
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!newItem.trim()) {
      return alert("Please enter an item name");
    }

    setAdding(true);

    try {
      const res = await api.post("/checklist/add", {
        tripId,
        item: newItem.trim(),
        category: newCategory,
      });

      setItems((prev) => [...prev, res.data.item]);

      setNewItem("");

      setNewCategory("Other");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add checklist item");
    } finally {
      setAdding(false);
    }
  };

  // =========================
  // Toggle Packed
  // =========================
  const handleToggle = async (id, packed) => {
    try {
      const res = await api.put(`/checklist/update/${id}`, {
        packed,
      });

      setItems((prev) =>
        prev.map((item) => (item._id === id ? res.data.item : item)),
      );
    } catch {
      alert("Failed to update item");
    }
  };

  // =========================
  // Delete Item
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this checklist item?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/checklist/delete/${id}`);

      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch {
      alert("Failed to delete item");
    }
  };

  // =========================
  // Reset Checklist
  // =========================
  const handleResetChecklist = async () => {
    const confirmReset = window.confirm("Reset all packed items?");

    if (!confirmReset) return;

    try {
      await api.put(`/checklist/reset/${tripId}`);

      setItems((prev) =>
        prev.map((item) => ({
          ...item,
          packed: false,
        })),
      );
    } catch {
      alert("Failed to reset checklist");
    }
  };

  // =========================
  // Filtering
  // =========================
  const filteredItems =
    filter === "All" ? items : items.filter((item) => item.category === filter);

  // =========================
  // Group by Category
  // =========================
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }

    acc[item.category].push(item);

    return acc;
  }, {});

  // =========================
  // Progress
  // =========================
  const packedCount = items.filter((item) => item.packed).length;

  const progress =
    items.length > 0 ? Math.round((packedCount / items.length) * 100) : 0;

  if (loading) return <Loader />;

  return (
    <div style={{ margin: "0 auto" }}>
      {/* =========================
          Header
      ========================= */}
      <div
        className="flex-between"
        style={{
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1 className="page-title">
            <i
              className="fas fa-list-check"
              style={{
                color: "var(--primary)",
                marginRight: "10px",
              }}
            />
            Packing Checklist
          </h1>

          <p className="page-subtitle">
            {trip?.tripName} — {packedCount}/{items.length} packed
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {items.length > 0 && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleResetChecklist}
            >
              <i className="fas fa-rotate-left" /> Reset Checklist
            </button>
          )}

          <Link
            to={`/trips/${tripId}/notes`}
            className="btn btn-secondary btn-sm"
          >
            <i className="fas fa-note-sticky" /> Notes
          </Link>
        </div>
      </div>

      {/* =========================
          Error
      ========================= */}
      {error && (
        <div className="alert alert-error">
          <i className="fas fa-circle-exclamation" /> {error}
        </div>
      )}

      {/* =========================
          Progress Card
      ========================= */}
      {items.length > 0 && (
        <div className="card" style={{ marginBottom: "20px" }}>
          <div className="flex-between" style={{ marginBottom: "8px" }}>
            <span
              style={{
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              Packing Progress
            </span>

            <span
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
              }}
            >
              {progress}%
            </span>
          </div>

          <div
            style={{
              height: "8px",
              background: "var(--border-color)",
              borderRadius: "var(--radius-full)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "var(--success)",
                borderRadius: "var(--radius-full)",
                width: `${progress}%`,
                transition: "width 0.4s ease",
              }}
            />
          </div>

          <p
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              marginTop: "6px",
            }}
          >
            {packedCount === items.length && items.length > 0
              ? "🎉 All packed! Ready to go!"
              : `${items.length - packedCount} items remaining`}
          </p>
        </div>
      )}

      {/* =========================
          Add Form
      ========================= */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <form
          onSubmit={handleAdd}
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          <div
            className="form-group"
            style={{
              flex: 1,
              minWidth: "180px",
              marginBottom: 0,
            }}
          >
            <label className="form-label">Checklist Item</label>

            <input
              type="text"
              id="checklist-item"
              className="form-input"
              placeholder="e.g., Passport"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
            />
          </div>

          <div
            className="form-group"
            style={{
              width: "180px",
              marginBottom: 0,
            }}
          >
            <label className="form-label">Category</label>

            <select
              id="checklist-category"
              className="form-select"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            >
              {CHECKLIST_CATEGORIES.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={adding}
            style={{ height: "44px" }}
          >
            {adding ? (
              <i className="fas fa-circle-notch fa-spin" />
            ) : (
              <>
                <i className="fas fa-plus" /> Add Item
              </>
            )}
          </button>
        </form>
      </div>

      {/* =========================
          Filters
      ========================= */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "18px",
        }}
      >
        {["All", ...CHECKLIST_CATEGORIES].map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`btn btn-sm ${
              filter === category ? "btn-primary" : "btn-secondary"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* =========================
          Empty State
      ========================= */}
      {filteredItems.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-suitcase" />

          <h3>No checklist items</h3>

          <p>Add items above to start preparing for your trip</p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <div className="card" key={category}>
              <div
                className="flex-between"
                style={{
                  marginBottom: "12px",
                }}
              >
                <h3
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                  }}
                >
                  {category}
                </h3>

                <span className="badge badge-primary">
                  {categoryItems.length} item
                  {categoryItems.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div style={{ padding: "4px" }}>
                {categoryItems.map((item) => (
                  <ChecklistItem
                    key={item._id}
                    item={item}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PackingChecklist;
