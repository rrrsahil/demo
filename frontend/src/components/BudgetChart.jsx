import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency, calculateTotal } from '../utils/calculateBudget'
import '../css/activityCard.css'

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const BudgetChart = ({ budget }) => {
  if (!budget) return null

  const data = [
    { name: 'Transport', value: Number(budget.transportCost || 0) },
    { name: 'Hotel', value: Number(budget.hotelCost || 0) },
    { name: 'Activities', value: Number(budget.activityCost || 0) },
    { name: 'Meals', value: Number(budget.mealCost || 0) },
    { name: 'Misc', value: Number(budget.miscCost || 0) },
  ].filter(d => d.value > 0)

  const total = calculateTotal(budget)

  if (data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
        <i className="fas fa-chart-pie" style={{ fontSize: '40px', color: 'var(--border-color)', marginBottom: '12px', display: 'block' }} />
        <p>No budget data to display yet.</p>
        <p style={{ fontSize: '13px', marginTop: '4px' }}>Fill in the costs on the left to see charts.</p>
      </div>
    )
  }

  return (
    <div className="budget-charts">
      {/* Pie Chart */}
      <div className="budget-chart-wrap">
        <h4 className="chart-title">Budget Distribution</h4>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={95}
              paddingAngle={3} dataKey="value">
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Legend iconType="circle" iconSize={10} />
          </PieChart>
        </ResponsiveContainer>
        <p style={{ textAlign: 'center', fontWeight: '600', fontSize: '15px', color: 'var(--text-primary)', marginTop: '8px' }}>
          Total: {formatCurrency(total, budget.currency)}
        </p>
      </div>

      {/* Bar Chart */}
      <div className="budget-chart-wrap">
        <h4 className="chart-title">Category Breakdown</h4>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${Math.round(v / 1000)}k`} />
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default BudgetChart
