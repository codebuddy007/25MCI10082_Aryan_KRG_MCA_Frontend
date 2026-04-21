import { useRef, useState } from 'react';
import NoteItem from './NoteItem'

const NotesApp = () => {

    const inputRef = useRef()
    const [notes, setNotes] = useState([])
    const [currEditIndex, setCurrEditIndex] = useState(null);

     const handleAdd = () => {
    const note = inputRef.current.value.trim();
    if (note === "") return;

    setNotes([...notes, note]);
    inputRef.current.value = "";
  };

   const handleDelete = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

    const handleEdit = (index) => {
    inputRef.current.value = notes[index];
    setCurrEditIndex(index);
  };

   const handleUpdate = (index) => {
    const note = inputRef.current.value.trim();
    if (note === "") return;

    const updatedNotes = [...notes];
    updatedNotes[currEditIndex] = note;
    setNotes(updatedNotes);

    inputRef.current.value = "";
    setCurrEditIndex(null);
  };

    return (
      <div className="notes-app-container">
        <h1 className="notes-title">NOTES APP</h1>
        <div className="notes-input-row">
          <input
            ref={inputRef}
            type="text"
            className="notes-input"
            placeholder="Enter your note here..."
          />
          <button className="note-btn add-btn" onClick={handleAdd}>Add</button>
        </div>
        <ul className="notes-list">
          {notes.map((note, index) => (
            <NoteItem
              key={index}
              note={note}
              index={index}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onUpdate={handleUpdate}
              isEditing={currEditIndex === index}
            />
          ))}
        </ul>
      </div>
    )
}

export default NotesApp
