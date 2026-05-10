import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/api'
import BudgetChart from '../components/BudgetChart'
import Loader from '../components/Loader'
import { calculateTotal, formatCurrency } from '../utils/calculateBudget'
import '../css/budget.css'

const BUDGET_FIELDS = [
  { key: 'transportCost', label: 'Transport', icon: 'fa-car', color: '#2563eb', bg: '#eff6ff' },
  { key: 'hotelCost', label: 'Hotel / Stay', icon: 'fa-hotel', color: '#10b981', bg: '#ecfdf5' },
  { key: 'activityCost', label: 'Activities', icon: 'fa-compass', color: '#f59e0b', bg: '#fffbeb' },
  { key: 'mealCost', label: 'Meals & Food', icon: 'fa-utensils', color: '#ef4444', bg: '#fef2f2' },
  { key: 'miscCost', label: 'Miscellaneous', icon: 'fa-receipt', color: '#8b5cf6', bg: '#f5f3ff' },
]
const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const BudgetBreakdown = () => {
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [budget, setBudget] = useState({ transportCost: 0, hotelCost: 0, activityCost: 0, mealCost: 0, miscCost: 0, currency: 'INR', notes: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [tripRes, budgetRes] = await Promise.all([
          api.get(`/trips/${tripId}`),
          api.get(`/budget/${tripId}`),
        ])
        setTrip(tripRes.data.data.trip)
        if (budgetRes.data.data.budget) setBudget(budgetRes.data.budget)
      } catch { setError('Failed to load budget') }
      finally { setLoading(false) }
    }
    load()
  }, [tripId])

  const handleChange = (key, value) => {
    setBudget(p => ({ ...p, [key]: value === '' ? 0 : Number(value) }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await api.post('/budget/calculate', { tripId, ...budget })
      setBudget(res.data.budget)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save budget')
    } finally { setSaving(false) }
  }

  const total = calculateTotal(budget)

  if (loading) return <Loader />

  return (
    <div>
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="page-title"><i className="fas fa-wallet" style={{ color: 'var(--primary)', marginRight: '10px' }} />Budget Breakdown</h1>
          <p className="page-subtitle">{trip?.tripName || 'Trip Budget'}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to={`/trips/${tripId}/checklist`} className="btn btn-secondary btn-sm">
            <i className="fas fa-list-check" /> Checklist
          </Link>
          <Link to={`/trips/${tripId}/notes`} className="btn btn-secondary btn-sm">
            <i className="fas fa-note-sticky" /> Notes
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-error"><i className="fas fa-circle-exclamation" /> {error}</div>}
      {saved && <div className="alert alert-success"><i className="fas fa-circle-check" /> Budget saved successfully!</div>}

      <div className="budget-layout">
        {/* Left: Form */}
        <div>
          {/* Total */}
          <div className="budget-total-card">
            <p className="budget-total-label">Total Estimated Budget</p>
            <p className="budget-total-amount">{formatCurrency(total, budget.currency)}</p>
            <p className="budget-total-currency">{budget.currency}</p>
          </div>

          {/* Inputs */}
          <div className="budget-form-card">
            <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>Enter Costs</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Fill in estimated costs per category</p>

            {BUDGET_FIELDS.map(f => (
              <div className="budget-input-row" key={f.key}>
                <div className="budget-input-icon" style={{ background: f.bg, color: f.color }}>
                  <i className={`fas ${f.icon}`} />
                </div>
                <span className="budget-input-label">{f.label}</span>
                <input type="number" className="budget-input-field" min="0" placeholder="0"
                  id={`budget-${f.key}`}
                  value={budget[f.key] || ''}
                  onChange={e => handleChange(f.key, e.target.value)} />
              </div>
            ))}

            <div style={{ marginTop: '16px' }}>
              <label className="form-label">Currency</label>
              <select id="budget-currency" className="form-select" value={budget.currency}
                onChange={e => setBudget(p => ({ ...p, currency: e.target.value }))}>
                {['INR', 'USD', 'EUR', 'GBP', 'AUD', 'SGD', 'AED'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label className="form-label">Budget Notes</label>
              <textarea className="form-textarea" id="budget-notes" rows={2} placeholder="Any notes about your budget..."
                value={budget.notes || ''} onChange={e => setBudget(p => ({ ...p, notes: e.target.value }))} />
            </div>

            <button className="btn btn-primary btn-full" style={{ marginTop: '16px' }} onClick={handleSave} disabled={saving}>
              {saving ? <><i className="fas fa-circle-notch fa-spin" /> Saving...</> : <><i className="fas fa-floppy-disk" /> Save Budget</>}
            </button>
          </div>

          {/* Breakdown bars */}
          {total > 0 && (
            <div className="budget-form-card" style={{ marginTop: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>Category Share</h3>
              <div className="budget-breakdown-list">
                {BUDGET_FIELDS.map((f, i) => {
                  const val = Number(budget[f.key] || 0)
                  const pct = total > 0 ? Math.round((val / total) * 100) : 0
                  return (
                    <div className="breakdown-item" key={f.key}>
                      <span className="breakdown-label" style={{ color: f.color }}><i className={`fas ${f.icon}`} style={{ marginRight: '6px' }} />{f.label}</span>
                      <div className="breakdown-bar-wrap">
                        <div className="breakdown-bar" style={{ width: `${pct}%`, background: f.color }} />
                      </div>
                      <span className="breakdown-amount">{pct}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: Charts */}
        <div>
          <BudgetChart budget={budget} />
        </div>
      </div>
    </div>
  )
}

export default BudgetBreakdown
