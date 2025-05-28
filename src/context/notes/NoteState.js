import NoteContext from "./noteContext";
import { useState } from "react";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


const NoteState = (props) => {
  const host = "http://localhost:5000"
  const notesInitial = []
  const [notes, setNotes] = useState(notesInitial)

  // Get all Notes
  const getNotes = async () => {
    // API Call 
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      }
    });
    const json = await response.json()
    setNotes(json)
  }

  // Add a Note
  const addNote = async (title, description, tag) => {
  const response = await fetch(`${host}/api/notes/addnote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'auth-token': localStorage.getItem('token')
    },
    body: JSON.stringify({ title, description, tag })
  });

  const note = await response.json();

  if (response.ok) {
    setNotes(notes.concat(note));

    // ✅ Show SweetAlert on success
    Swal.fire({
      icon: 'success',
      title: 'Note Added',
      text: 'Your note has been added successfully!',
      timer: 1500,
      showConfirmButton: false
    });
  } else {
    // ❌ Show SweetAlert on error
    Swal.fire({
  toast: true,
  position: 'top-end',
  icon: 'success',
  title: 'Note added',
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true
});
  }
};

  // Delete a Note
  
const deleteNote = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  });

  if (result.isConfirmed) {
    // API Call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      }
    });
    console.log(response);
    const newNotes = notes.filter((note) => note._id !== id);
    setNotes(newNotes);

    Swal.fire(
      'Deleted!',
      'Your note has been deleted.',
      'success'
    );
  }
};

  // Edit a Note
 const editNote = async (id, title, description, tag) => {
  // API Call 
  const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      "auth-token": localStorage.getItem('token')
    },
    body: JSON.stringify({title, description, tag})
  });
  
  const json = await response.json();

  if (response.ok) {
    let newNotes = JSON.parse(JSON.stringify(notes))
    // Logic to edit in client
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag; 
        break; 
      }
    }  
    setNotes(newNotes);

    // SweetAlert on success
    Swal.fire({
      icon: 'success',
      title: 'Note Updated',
      text: 'Your note has been updated successfully!',
      timer: 2000,
      showConfirmButton: false
    });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Update Failed',
      text: json.error || 'Something went wrong!',
    });
  }
}

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  )

}
export default NoteState;