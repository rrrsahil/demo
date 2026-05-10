import { useState, useEffect } from 'react'
import api from '../api/api'
import ActivityCard from '../components/ActivityCard'
import Loader from '../components/Loader'
import { ACTIVITY_CATEGORIES } from '../utils/constants'

const ActivitySearch = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    api.get('/activities')
      .then(res => setActivities(res.data.activities))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = activities.filter(a => {
    const matchSearch = a.activityName.toLowerCase().includes(search.toLowerCase()) ||
      a.description?.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || a.category === category
    return matchSearch && matchCat
  })

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title"><i className="fas fa-compass" style={{ color: 'var(--primary)', marginRight: '10px' }} />Activity Explorer</h1>
        <p className="page-subtitle">Discover activities to add to your trips</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="input-icon-wrap" style={{ flex: 1, minWidth: '200px', maxWidth: '380px' }}>
          <i className="fas fa-magnifying-glass input-icon" />
          <input type="text" id="act-search" className="form-input" placeholder="Search activities..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {ACTIVITY_CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`btn btn-sm ${category === c ? 'btn-primary' : 'btn-secondary'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading && <Loader />}
      {!loading && filtered.length === 0 && (
        <div className="empty-state">
          <i className="fas fa-compass" />
          <h3>No activities found</h3>
          <p>Try a different search or category</p>
        </div>
      )}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filtered.map(act => (
            <ActivityCard key={act._id} activity={act} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ActivitySearch
