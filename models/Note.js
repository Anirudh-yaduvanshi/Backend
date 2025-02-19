const mongoose = require('mongoose');
const User = require('./User');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
        
    }
    ,
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        default: 'general',
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('notes', NotesSchema);