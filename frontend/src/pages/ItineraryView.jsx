import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/api'
import Loader from '../components/Loader'
import { formatDate } from '../utils/formatDate'
import { formatCurrency } from '../utils/calculateBudget'

const ItineraryView = () => {
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [itinerary, setItinerary] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [tripRes, itinRes] = await Promise.all([
          api.get(`/trips/${tripId}`),
          api.get(`/itinerary/${tripId}`),
        ])
        setTrip(tripRes.data.trip)
        setItinerary(itinRes.data.itinerary)
      } catch {} finally { setLoading(false) }
    }
    load()
  }, [tripId])

  if (loading) return <Loader />

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="page-title"><i className="fas fa-scroll" style={{ color: 'var(--primary)', marginRight: '10px' }} />Itinerary View</h1>
          <p className="page-subtitle">{trip?.tripName}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to={`/trips/${tripId}/itinerary`} className="btn btn-secondary btn-sm">
            <i className="fas fa-edit" /> Edit
          </Link>
          <Link to={`/trips/${tripId}/budget`} className="btn btn-primary btn-sm">
            <i className="fas fa-wallet" /> Budget
          </Link>
        </div>
      </div>

      {/* Trip Summary Card */}
      {trip && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { icon: 'fa-calendar-days', label: 'Start', value: formatDate(trip.startDate) },
              { icon: 'fa-calendar-check', label: 'End', value: formatDate(trip.endDate) },
              { icon: 'fa-map-pin', label: 'Days', value: `${itinerary.length} planned` },
              { icon: 'fa-location-dot', label: 'Destinations', value: trip.destinations?.map(d => d.city).join(', ') || '—' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', background: 'var(--primary-light)',
                  borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--primary)', fontSize: '14px', flexShrink: 0
                }}>
                  <i className={`fas ${item.icon}`} />
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.label}</p>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      {itinerary.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-calendar-plus" />
          <h3>No itinerary planned</h3>
          <p>Add days in the Itinerary Builder to see your full trip plan here.</p>
          <Link to={`/trips/${tripId}/itinerary`} className="btn btn-primary">
            <i className="fas fa-plus" /> Build Itinerary
          </Link>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          {/* Timeline line */}
          <div style={{
            position: 'absolute', left: '20px', top: '20px', bottom: '20px',
            width: '2px', background: 'var(--border-color)', zIndex: 0
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {itinerary.map((day, idx) => {
              const totalCost = day.activities.reduce((sum, a) => sum + (a.cost || 0), 0)
              return (
                <div key={day._id} style={{ display: 'flex', gap: '20px', position: 'relative', zIndex: 1 }}>
                  {/* Day badge */}
                  <div style={{
                    width: '40px', height: '40px', background: 'var(--primary)',
                    color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: '700', fontSize: '13px',
                    flexShrink: 0, border: '3px solid var(--secondary-bg)', zIndex: 2
                  }}>
                    {day.day}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, paddingBottom: idx === itinerary.length - 1 ? 0 : '8px' }}>
                    <div className="card" style={{ marginBottom: 0 }}>
                      <div className="flex-between" style={{ marginBottom: '12px' }}>
                        <div>
                          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                            Day {day.day} — {day.city}
                          </h3>
                          {day.date && (
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formatDate(day.date)}</p>
                          )}
                        </div>
                        {totalCost > 0 && (
                          <span className="badge badge-primary">{formatCurrency(totalCost)}</span>
                        )}
                      </div>

                      {day.activities.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {day.activities.map((act, i) => (
                            <div key={i} style={{
                              display: 'flex', alignItems: 'center', gap: '10px',
                              padding: '10px 12px', background: 'var(--secondary-bg)',
                              borderRadius: 'var(--radius-sm)', fontSize: '13px'
                            }}>
                              <span style={{ fontSize: '16px' }}>
                                {act.category === 'Adventure' ? '🧗' : act.category === 'Food' ? '🍜' : act.category === 'Culture' ? '🏛️' : act.category === 'Nature' ? '🌿' : act.category === 'Shopping' ? '🛍️' : '📌'}
                              </span>
                              <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{act.activityName}</p>
                                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{act.duration} • {act.category}</p>
                              </div>
                              <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '13px' }}>
                                {act.cost === 0 ? 'Free' : formatCurrency(act.cost)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No activities planned for this day.</p>
                      )}

                      {day.notes && (
                        <div style={{ marginTop: '12px', padding: '10px', background: '#fffbeb', borderRadius: 'var(--radius-sm)', fontSize: '13px', color: '#92400e' }}>
                          <i className="fas fa-note-sticky" style={{ marginRight: '6px' }} /> {day.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ItineraryView
