import React, { useContext } from 'react';
import noteContext from "../context/notes/noteContext";

const NoteItem = ({ note, updateNote }) => {
  const context = useContext(noteContext);
  const { deleteNote } = context;

  return (
    <div className="col-md-4 col-lg-3 mb-4">
      <div className="card h-100 shadow-sm">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{note.title}</h5>
          <p className="card-text flex-grow-1">{note.description}</p>
          <p className="card-text text-muted">{note.tag}</p>
          <div className="mt-auto">
            <i className="fa-solid fa-trash text-danger me-2" style={{ cursor: "pointer" }} onClick={() => deleteNote(note._id)}></i>
            <i className="fa-solid fa-pen-to-square text-primary" style={{ cursor: "pointer" }} onClick={() => updateNote(note)}></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
