
const NoteItem = ({  note, index, onDelete, onEdit, onUpdate, isEditing }) => {
  return (
    <div className="note-item-card">
      <li className="note-item-content">
        <span className="note-text">{note}</span>
        <div className="note-actions">
          <button className="note-btn edit-btn" onClick={() => onEdit(index)}>Edit</button>
          {isEditing && (
            <button className="note-btn update-btn" onClick={() => onUpdate(index)}>Update</button>
          )}
          <button className="note-btn delete-btn" onClick={() => onDelete(index)}>Delete</button>
        </div>
      </li>
    </div>
  );
}

export default NoteItem
