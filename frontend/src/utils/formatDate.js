export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export const formatDateInput = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toISOString().split('T')[0]
}

export const getDuration = (start, end) => {
  if (!start || !end) return 0
  const diff = new Date(end) - new Date(start)
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}
