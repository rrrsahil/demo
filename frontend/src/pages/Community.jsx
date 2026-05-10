import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/api'
import Loader from '../components/Loader'
import { formatDate, getDuration } from '../utils/formatDate'
import { API_BASE } from '../utils/constants'

const Community = () => {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/trips/public')
      .then(res => setTrips(res.data.trips))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 className="page-title"><i className="fas fa-users" style={{ color: 'var(--primary)', marginRight: '10px' }} />Community Trips</h1>
        <p className="page-subtitle">Explore public trips shared by fellow travelers</p>
      </div>

      {loading && <Loader />}

      {!loading && trips.length === 0 && (
        <div className="empty-state">
          <i className="fas fa-globe" />
          <h3>No public trips yet</h3>
          <p>Be the first to share a trip! Create a trip and make it public.</p>
          <Link to="/trips/create" className="btn btn-primary"><i className="fas fa-plus" /> Create Trip</Link>
        </div>
      )}

      {!loading && trips.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {trips.map(trip => {
            const duration = getDuration(trip.startDate, trip.endDate)
            return (
              <div className="card" key={trip._id} style={{ padding: 0, overflow: 'hidden' }}>
                {/* Cover */}
                <div style={{ height: '160px', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', color: 'var(--primary)' }}>
                  {trip.coverImage
                    ? <img src={`${API_BASE}${trip.coverImage}`} alt={trip.tripName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <i className="fas fa-map-location-dot" />
                  }
                </div>
                <div style={{ padding: '16px' }}>
                  {/* Author */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: 'var(--primary-light)', color: 'var(--primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700'
                    }}>
                      {trip.userId?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{trip.userId?.name || 'Traveler'}</span>
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>{trip.tripName}</h3>
                  {trip.description && (
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {trip.description}
                    </p>
                  )}

                  {trip.destinations?.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--secondary-bg)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', marginBottom: '10px' }}>
                      <i className="fas fa-location-dot" style={{ color: 'var(--primary)' }} />
                      {trip.destinations.map(d => d.city).join(' → ')}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <span><i className="fas fa-calendar-days" style={{ marginRight: '4px' }} />{formatDate(trip.startDate)}</span>
                    <span><i className="fas fa-clock" style={{ marginRight: '4px' }} />{duration} days</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Community
