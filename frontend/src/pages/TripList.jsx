import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/api'
import TripCard from '../components/TripCard'
import Loader from '../components/Loader'



const TripList = () => {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.get('/trips')
      .then(res => setTrips(res.data.trips))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trip and all its data?')) return
    try {
      await api.delete(`/trips/${id}`)
      setTrips(p => p.filter(t => t._id !== id))
    } catch { alert('Delete failed') }
  }

  const filtered = trips.filter(t => {
    const matchSearch = t.tripName.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || t.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div>
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="page-title"><i className="fas fa-suitcase-rolling" style={{ color: 'var(--primary)', marginRight: '10px' }} />My Trips</h1>
          <p className="page-subtitle">{trips.length} trip{trips.length !== 1 ? 's' : ''} in total</p>
        </div>
        <Link to="/trips/create" className="btn btn-primary">
          <i className="fas fa-plus" /> New Trip
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="input-icon-wrap" style={{ flex: '1', minWidth: '200px', maxWidth: '360px' }}>
          <i className="fas fa-magnifying-glass input-icon" />
          <input type="text" id="trip-search" className="form-input" placeholder="Search trips..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {['all', 'planning', 'ongoing', 'completed'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}
            style={{ textTransform: 'capitalize' }}>
            {s}
          </button>
        ))}
      </div>

      {/* List */}
      {loading && <Loader />}

      {!loading && filtered.length === 0 && (
        <div className="empty-state">
          <i className="fas fa-magnifying-glass" />
          <h3>{search || filter !== 'all' ? 'No trips found' : 'No trips yet'}</h3>
          <p>{search ? `No results for "${search}"` : 'Create your first trip to get started'}</p>
          {!search && filter === 'all' && (
            <Link to="/trips/create" className="btn btn-primary"><i className="fas fa-plus" /> Create Trip</Link>
          )}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '20px' }}>
          {filtered.map(trip => (
            <TripCard key={trip._id} trip={trip} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

export default TripList
