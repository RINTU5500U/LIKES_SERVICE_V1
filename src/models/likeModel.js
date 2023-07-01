const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        trim: true 
    },
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content',
        trim: true
    },
    isLike: {
        type: Boolean,
        default: false
    } 
});

module.exports = mongoose.model('Like', likeSchema) 