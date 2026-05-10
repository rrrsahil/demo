export const calculateTotal = (budget) => {
  if (!budget) return 0
  return (
    Number(budget.transportCost || 0) +
    Number(budget.hotelCost || 0) +
    Number(budget.activityCost || 0) +
    Number(budget.mealCost || 0) +
    Number(budget.miscCost || 0)
  )
}

export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency, maximumFractionDigits: 0,
  }).format(amount || 0)
}
