const express = require('express');
const router = express.Router();
const { addNote, getNotes, updateNote, deleteNote } = require('../controllers/notes.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/add', protect, addNote);
router.get('/:tripId', protect, getNotes);
router.put('/:id', protect, updateNote);
router.delete('/:id', protect, deleteNote);

module.exports = router;
