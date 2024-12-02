const express = require('express')
const router = express.Router()
const fetchUser = require("../middleware/fetchsuer");
const Notes = require("../models/Note");
const { validationResult, body } = require('express-validator');

// Route 1: fetch all notes from the database of a specific user  
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        const notes = await Notes.find({ User: req.user.id })
        res.json(notes);

    }

    catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// Route 2: add new notes post : http://localhost:5000/api/note/addnote   login required  
router.post('/addnote', fetchUser, [
    body('title', 'Title is required').notEmpty(),
    body('description', 'Description is required').notEmpty(),
    body('tag', 'tag is required').notEmpty(),

], async (req, res) => {
    const errors = validationResult(req)
    // check if there are any errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const { title, description, tag } = req.body;
        const note = new Notes({
            User: req.user.id, title, description, tag

        })
        const savedNote = await note.save()

        res.json(savedNote)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// Route 3:update added note Put : http://localhost:5000/api/note/updatenote   login required  
router.put('/updatenote/:id', fetchUser, async (req, res) => {

    const { title, description, tag } = req.body;
    let newnote = {};
    if (title) { newnote.title = title; }
    if (description) { newnote.description = description; }
    if (tag) { newnote.tag = tag; }


    // find the note that has to be updated

    try {
        const id = req.params.id;
        const note = await Notes.findById(id);

        if (!note) return res.status(404).send('Note not found');
        if (note.User.toString() !== req.user.id) { return res.status(401).send('not allowed'); }

        let Updatednote = await Notes.findByIdAndUpdate(id, { $set: newnote }, { new: true });

        res.json({ Updatednote });
    } catch (err) {

        console.error(err.message);

        res.status(500).send('Server Error');

    }
})

// Route 4:delete added note DELETE : http://localhost:5000/api/note/deletenote/:id   login required  
router.delete('/deletenote/:id', fetchUser, async (req, res) => {


    try {
        const id = req.params.id;
        let note = await Notes.findById(id);
        if (!note) return res.status(404).send('Note not found');

        if (note.User.toString() !== req.user.id) { return res.status(401).send('not allowed'); }

        note = await Notes.findByIdAndDelete(id);



        res.json({ message: 'Note deleted', note: note });

    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');

    }



})

module.exports = router