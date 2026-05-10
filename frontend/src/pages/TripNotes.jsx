import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";
import Loader from "../components/Loader";
import { formatDate } from "../utils/formatDate";

const TripNotes = () => {
  const { tripId } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState(null);
  const [form, setForm] = useState({
    title: "",
    dayLabel: "",
    note: "",
  });
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", note: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [tripRes, notesRes] = await Promise.all([
          api.get(`/trips/${tripId}`),
          api.get(`/notes/${tripId}`),
        ]);

        setTrip(tripRes.data.trip);
        setNotes(notesRes.data.notes);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load trip notes");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [tripId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.note.trim()) return setError("Note content is required");
    setAdding(true);
    setError("");
    try {
      const res = await api.post("/notes/add", {
        tripId,
        title: form.title,
        dayLabel: form.dayLabel,
        note: form.note,
      });
      setNotes((p) => [res.data.note, ...p]);
      setForm({
        title: "",
        dayLabel: "",
        note: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add note");
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    setEditForm({ title: note.title, note: note.note });
  };

  const handleUpdate = async (id) => {
    if (!editForm.note.trim()) return;
    try {
      const res = await api.put(`/notes/${id}`, editForm);
      setNotes((p) => p.map((n) => (n._id === id ? res.data.note : n)));
      setEditingId(null);
    } catch {
      alert("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes((p) => p.filter((n) => n._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={{ margin: "0 auto" }}>
      <div
        className="flex-between"
        style={{ marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}
      >
        <div>
          <h1 className="page-title">
            <i
              className="fas fa-note-sticky"
              style={{ color: "var(--primary)", marginRight: "10px" }}
            />
            Trip Notes
          </h1>
          <p className="page-subtitle">
            {trip?.tripName} — {notes.length} note
            {notes.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          to={`/trips/${tripId}/checklist`}
          className="btn btn-secondary btn-sm"
        >
          <i className="fas fa-list-check" /> Checklist
        </Link>
      </div>

      {/* Add Note */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h3
          style={{ fontSize: "15px", fontWeight: "600", marginBottom: "16px" }}
        >
          <i
            className="fas fa-plus"
            style={{ color: "var(--primary)", marginRight: "8px" }}
          />
          Add Note
        </h3>
        {error && (
          <div className="alert alert-error">
            <i className="fas fa-circle-exclamation" /> {error}
          </div>
        )}
        <form onSubmit={handleAdd}>
          <div className="form-group">
            <label className="form-label">Title (optional)</label>
            <input
              type="text"
              id="note-title"
              className="form-input"
              placeholder="e.g., Flight Details"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Day / Stop (optional)</label>

            <input
              type="text"
              className="form-input"
              placeholder="e.g., Day 2 - Goa Beach"
              value={form.dayLabel}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  dayLabel: e.target.value,
                }))
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Note *</label>
            <textarea
              id="note-content"
              className="form-textarea"
              rows={4}
              placeholder="Write your travel notes, tips, reminders..."
              value={form.note}
              onChange={(e) => {
                setForm((p) => ({ ...p, note: e.target.value }));
                setError("");
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={adding}>
            {adding ? (
              <>
                <i className="fas fa-circle-notch fa-spin" /> Adding...
              </>
            ) : (
              <>
                <i className="fas fa-plus" /> Add Note
              </>
            )}
          </button>
        </form>
      </div>

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-note-sticky" />
          <h3>No notes yet</h3>
          <p>Add notes, reminders, and journal entries for your trip</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {notes.map((note) => (
            <div className="card" key={note._id}>
              {editingId === note._id ? (
                <div>
                  <input
                    type="text"
                    className="form-input"
                    style={{ marginBottom: "10px" }}
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, title: e.target.value }))
                    }
                    placeholder="Title"
                  />
                  <textarea
                    className="form-textarea"
                    rows={4}
                    value={editForm.note}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, note: e.target.value }))
                    }
                  />
                  <div
                    style={{ display: "flex", gap: "8px", marginTop: "10px" }}
                  >
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleUpdate(note._id)}
                    >
                      <i className="fas fa-floppy-disk" /> Save
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    className="flex-between"
                    style={{ marginBottom: "10px" }}
                  >
                    <div>
                      {note.title && (
                        <h4
                          style={{
                            fontSize: "15px",
                            fontWeight: "600",
                            color: "var(--text-primary)",
                            marginBottom: "2px",
                          }}
                        >
                          {note.title}
                        </h4>
                      )}
                      {note.dayLabel && (
                        <p
                          style={{
                            fontSize: "12px",
                            color: "var(--primary)",
                            fontWeight: "500",
                            marginBottom: "4px",
                          }}
                        >
                          <i
                            className="fas fa-location-dot"
                            style={{ marginRight: "4px" }}
                          />

                          {note.dayLabel}
                        </p>
                      )}
                      <p
                        style={{ fontSize: "12px", color: "var(--text-muted)" }}
                      >
                        <i
                          className="fas fa-clock"
                          style={{ marginRight: "4px" }}
                        />
                        Created: {formatDate(note.createdAt)}
                        {note.updatedAt !== note.createdAt && (
                          <>
                            {" • "}
                            Updated: {formatDate(note.updatedAt)}
                          </>
                        )}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => startEdit(note)}
                        title="Edit"
                      >
                        <i className="fas fa-pen" />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleDelete(note._id)}
                        title="Delete"
                        style={{ color: "var(--danger)" }}
                      >
                        <i className="fas fa-trash" />
                      </button>
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--text-secondary)",
                      lineHeight: "1.6",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {note.note}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripNotes;
