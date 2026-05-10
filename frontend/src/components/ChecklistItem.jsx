import '../css/checklist.css'

const ChecklistItem = ({ item, onToggle, onDelete }) => {
  return (
    <div className={`checklist-item ${item.packed ? 'packed' : ''}`}>
      <button className="checklist-check" onClick={() => onToggle(item._id, !item.packed)}>
        <i className={`fas ${item.packed ? 'fa-circle-check' : 'fa-circle'}`} />
      </button>
      <div className="checklist-content">
        <span className="checklist-text">{item.item}</span>
        <span className="checklist-category">{item.category}</span>
      </div>
      <button className="checklist-delete" onClick={() => onDelete(item._id)}>
        <i className="fas fa-xmark" />
      </button>
    </div>
  )
}

export default ChecklistItem
