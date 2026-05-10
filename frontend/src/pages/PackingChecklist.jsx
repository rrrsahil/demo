import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/api'
import ChecklistItem from '../components/ChecklistItem'
import Loader from '../components/Loader'
import { CHECKLIST_CATEGORIES } from '../utils/constants'

const PackingChecklist = () => {
  const { tripId } = useParams()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [newItem, setNewItem] = useState('')
  const [newCategory, setNewCategory] = useState('Other')
  const [adding, setAdding] = useState(false)
  const [filter, setFilter] = useState('All')
  const [trip, setTrip] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [tripRes, listRes] = await Promise.all([
          api.get(`/trips/${tripId}`),
          api.get(`/checklist/${tripId}`),
        ])
        setTrip(tripRes.data.trip)
        setItems(listRes.data.items)
      } catch {} finally { setLoading(false) }
    }
    load()
  }, [tripId])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newItem.trim()) return
    setAdding(true)
    try {
      const res = await api.post('/checklist/add', { tripId, item: newItem.trim(), category: newCategory })
      setItems(p => [...p, res.data.item])
      setNewItem('')
    } catch (err) { alert(err.response?.data?.message || 'Failed to add item') }
    finally { setAdding(false) }
  }

  const handleToggle = async (id, packed) => {
    try {
      const res = await api.put(`/checklist/update/${id}`, { packed })
      setItems(p => p.map(i => i._id === id ? res.data.item : i))
    } catch { alert('Failed to update item') }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/checklist/delete/${id}`)
      setItems(p => p.filter(i => i._id !== id))
    } catch { alert('Failed to delete item') }
  }

  const filtered = filter === 'All' ? items : items.filter(i => i.category === filter)
  const packed = items.filter(i => i.packed).length

  if (loading) return <Loader />

  return (
    <div style={{ margin: '0 auto' }}>
      <div className="flex-between" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="page-title"><i className="fas fa-list-check" style={{ color: 'var(--primary)', marginRight: '10px' }} />Packing Checklist</h1>
          <p className="page-subtitle">{trip?.tripName} — {packed}/{items.length} packed</p>
        </div>
        <Link to={`/trips/${tripId}/notes`} className="btn btn-secondary btn-sm">
          <i className="fas fa-note-sticky" /> Notes
        </Link>
      </div>

      {/* Progress */}
      {items.length > 0 && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="flex-between" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '500' }}>Packing Progress</span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{Math.round((packed / items.length) * 100)}%</span>
          </div>
          <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', background: 'var(--success)', borderRadius: 'var(--radius-full)',
              width: `${items.length > 0 ? (packed / items.length) * 100 : 0}%`, transition: 'width 0.4s ease'
            }} />
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            {packed === items.length && items.length > 0 ? '🎉 All packed! Ready to go!' : `${items.length - packed} items remaining`}
          </p>
        </div>
      )}

      {/* Add Form */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '160px', marginBottom: 0 }}>
            <label className="form-label">Item</label>
            <input type="text" id="checklist-item" className="form-input" placeholder="e.g., Passport"
              value={newItem} onChange={e => setNewItem(e.target.value)} />
          </div>
          <div className="form-group" style={{ width: '150px', marginBottom: 0 }}>
            <label className="form-label">Category</label>
            <select id="checklist-cat" className="form-select" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
              {CHECKLIST_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <button type="submit" className="btn btn-primary" disabled={adding} style={{ height: '44px' }}>
            {adding ? <i className="fas fa-circle-notch fa-spin" /> : <><i className="fas fa-plus" /> Add</>}
          </button>
        </form>
      </div>

      {/* Category Filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {['All', ...CHECKLIST_CATEGORIES].map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`btn btn-sm ${filter === c ? 'btn-primary' : 'btn-secondary'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Items */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-suitcase" />
          <h3>No items yet</h3>
          <p>Add items to your packing list above</p>
        </div>
      ) : (
        <div className="card" style={{ padding: '8px' }}>
          {filtered.map(item => (
            <ChecklistItem key={item._id} item={item} onToggle={handleToggle} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

export default PackingChecklist
