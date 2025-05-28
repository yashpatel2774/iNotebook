const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const Note = require("../models/Note");

// ROUTE 1: Get all notes using GET: '/api/notes/fetchallnotes'. Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ROUTE 2: Add a new Note using POST: '/api/notes/addnote'. Login required
router.post("/addnote", fetchuser, [
  body("title", "Enter a valid title").isLength({ min: 3 }),
  body("description", "Enter a valid description").isLength({ min: 5 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, tag } = req.body;

    const note = new Note({
      title,
      description,
      tag,
      user: req.user.id,
    });
    const savedNote = await note.save();
    res.json(savedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ROUTE 3: Update an existing Note using PUT: '/api/notes/updatenote/:id'. Login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;

  const newNote = {};
  if (title) newNote.title = title;
  if (description) newNote.description = description;
  if (tag) newNote.tag = tag;

  try {
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not allowed" });
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ROUTE 4: Delete an existing Note using DELETE: '/api/notes/deletenote/:id'. Login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not allowed" });
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ success: "Successfully deleted the note", note: note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
