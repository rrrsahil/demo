import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/api'
import { API_BASE } from '../utils/constants'
import '../css/createTrip.css'

const STEPS = ['Trip Info', 'Destinations', 'Cover Image']

const EditTrip = () => {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const fileRef = useRef(null)
  
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [coverPreview, setCoverPreview] = useState(null)
  const [coverFile, setCoverFile] = useState(null)

  const [form, setForm] = useState({
    tripName: '', description: '', startDate: '', endDate: '', isPublic: false, status: 'planning'
  })
  const [formErrors, setFormErrors] = useState({})
  const [destinations, setDestinations] = useState([])
  const [destForm, setDestForm] = useState({ city: '', country: '', nights: 1 })

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await api.get(`/trips/${tripId}`)
        const trip = res.data.trip
        
        // Format dates for input[type="date"]
        const start = new Date(trip.startDate).toISOString().split('T')[0]
        const end = new Date(trip.endDate).toISOString().split('T')[0]

        setForm({
          tripName: trip.tripName || '',
          description: trip.description || '',
          startDate: start,
          endDate: end,
          isPublic: trip.isPublic || false,
          status: trip.status || 'planning'
        })
        
        if (trip.destinations) setDestinations(trip.destinations)
        if (trip.coverImage) setCoverPreview(`${API_BASE}${trip.coverImage}`)
        
      } catch (err) {
        setError('Failed to fetch trip details')
      } finally {
        setFetching(false)
      }
    }
    fetchTrip()
  }, [tripId])

  const validateStep0 = () => {
    const errs = {}
    if (!form.tripName.trim()) errs.tripName = 'Trip name is required'
    else if (form.tripName.length < 3) errs.tripName = 'Minimum 3 characters'
    if (!form.startDate) errs.startDate = 'Start date is required'
    if (!form.endDate) errs.endDate = 'End date is required'
    if (form.startDate && form.endDate && new Date(form.startDate) >= new Date(form.endDate)) {
      errs.endDate = 'End date must be after start date'
    }
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (step === 0 && !validateStep0()) return
    setStep(s => s + 1)
  }

  const addDestination = () => {
    if (!destForm.city.trim()) return
    setDestinations(p => [...p, { ...destForm, nights: Number(destForm.nights) || 1 }])
    setDestForm({ city: '', country: '', nights: 1 })
  }

  const removeDestination = (i) => setDestinations(p => p.filter((_, idx) => idx !== i))

  const handleCoverChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setCoverFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setCoverPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (step === 0 && !validateStep0()) return;
    setLoading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('tripName', form.tripName)
      fd.append('description', form.description)
      fd.append('startDate', form.startDate)
      fd.append('endDate', form.endDate)
      fd.append('isPublic', form.isPublic)
      fd.append('status', form.status)
      fd.append('destinations', JSON.stringify(destinations))
      if (coverFile) fd.append('coverImage', coverFile)

      await api.put(`/trips/${tripId}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      navigate(`/trips/${tripId}/itinerary`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update trip')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="create-trip-wrap" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <i className="fas fa-circle-notch fa-spin fa-2x" style={{ color: 'var(--primary)' }}></i>
        <p style={{ marginTop: '16px' }}>Loading trip data...</p>
      </div>
    )
  }

  return (
    <div className="create-trip-wrap">
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title"><i className="fas fa-pen-to-square" style={{ color: 'var(--primary)', marginRight: '10px' }} />Edit Trip</h1>
          <p className="page-subtitle">Modify your travel plan details</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/trips')}>Cancel</button>
      </div>

      <div className="create-trip-card">
        {/* Step Indicator */}
        <div className="step-indicator">
          {STEPS.map((label, i) => (
            <div key={i} className={`step ${i < step ? 'done' : ''} ${i === step ? 'active' : ''}`}>
              <div className="step-num">
                {i < step ? <i className="fas fa-check" style={{ fontSize: '12px' }} /> : i + 1}
              </div>
              <span className="step-label">{label}</span>
            </div>
          ))}
        </div>

        {error && <div className="alert alert-error"><i className="fas fa-circle-exclamation" /> {error}</div>}

        {/* Step 0: Trip Info */}
        {step === 0 && (
          <div>
            <div className="form-group">
              <label className="form-label">Trip Name *</label>
              <input type="text" id="trip-name" className="form-input" placeholder="e.g., Goa Beach Holiday 2025"
                value={form.tripName} onChange={e => { setForm(p => ({ ...p, tripName: e.target.value })); setFormErrors(p => ({ ...p, tripName: '' })) }} />
              {formErrors.tripName && <span className="form-error"><i className="fas fa-circle-exclamation" />{formErrors.tripName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" id="trip-desc" placeholder="What's this trip about? Add a short description..."
                value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <input type="date" id="trip-start" className="form-input"
                  value={form.startDate} 
                  onChange={e => { setForm(p => ({ ...p, startDate: e.target.value })); setFormErrors(p => ({ ...p, startDate: '' })) }} />
                {formErrors.startDate && <span className="form-error">{formErrors.startDate}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">End Date *</label>
                <input type="date" id="trip-end" className="form-input"
                  value={form.endDate} min={form.startDate || ''}
                  onChange={e => { setForm(p => ({ ...p, endDate: e.target.value })); setFormErrors(p => ({ ...p, endDate: '' })) }} />
                {formErrors.endDate && <span className="form-error">{formErrors.endDate}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  <option value="planning">Planning</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}>
                <input type="checkbox" id="trip-public" checked={form.isPublic}
                  onChange={e => setForm(p => ({ ...p, isPublic: e.target.checked }))}
                  style={{ width: 'auto', accentColor: 'var(--primary)' }} />
                Make this trip public (visible in Community)
              </label>
            </div>
          </div>
        )}

        {/* Step 1: Destinations */}
        {step === 1 && (
          <div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Modify the cities you'll be visiting on this trip.
            </p>
            {destinations.length > 0 && (
              <div className="destination-list">
                {destinations.map((d, i) => (
                  <div className="destination-item" key={i}>
                    <i className="fas fa-location-dot" style={{ color: 'var(--primary)' }} />
                    <div className="destination-item-content">
                      <p className="destination-item-city">{d.city}{d.country ? `, ${d.country}` : ''}</p>
                      <p className="destination-item-nights">{d.nights} night{d.nights > 1 ? 's' : ''}</p>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => removeDestination(i)} style={{ color: 'var(--danger)' }}>
                      <i className="fas fa-xmark" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="destination-add-form">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">City *</label>
                <input type="text" id="dest-city" className="form-input" placeholder="e.g., Mumbai"
                  value={destForm.city} onChange={e => setDestForm(p => ({ ...p, city: e.target.value }))} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Nights</label>
                <input type="number" id="dest-nights" className="form-input" placeholder="1" min="1"
                  value={destForm.nights} onChange={e => setDestForm(p => ({ ...p, nights: e.target.value }))} />
              </div>
              <button className="btn btn-primary" onClick={addDestination} style={{ height: '44px', marginTop: '22px' }}>
                <i className="fas fa-plus" /> Add
              </button>
            </div>
            {destinations.length === 0 && (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
                <i className="fas fa-info-circle" /> You currently have no destinations set.
              </p>
            )}
          </div>
        )}

        {/* Step 2: Cover Image */}
        {step === 2 && (
          <div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Update the cover photo for your trip.
            </p>
            <div className="cover-preview" onClick={() => fileRef.current?.click()}>
              {coverPreview
                ? <img src={coverPreview} alt="Cover" />
                : (
                  <div className="cover-preview-placeholder">
                    <i className="fas fa-cloud-arrow-up" />
                    <p>Click to upload cover image</p>
                    <p style={{ fontSize: '11px', marginTop: '4px' }}>JPG, PNG, WEBP — Max 5MB</p>
                  </div>
                )
              }
            </div>
            <input ref={fileRef} type="file" id="trip-cover" accept="image/*" style={{ display: 'none' }}
              onChange={handleCoverChange} />
            {coverPreview && (
              <button className="btn btn-secondary btn-sm" onClick={() => { setCoverPreview(null); setCoverFile(null) }}>
                <i className="fas fa-xmark" /> Remove Image
              </button>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="form-actions">
          {step > 0 && (
            <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)} disabled={loading}>
              <i className="fas fa-arrow-left" /> Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button className="btn btn-primary" onClick={handleNext}>
              Next <i className="fas fa-arrow-right" />
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? <><i className="fas fa-circle-notch fa-spin" /> Saving...</> : <><i className="fas fa-save" /> Save Changes</>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default EditTrip
