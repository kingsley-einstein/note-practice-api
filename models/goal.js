const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GoalSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: 80
    },
    userId: String,
    pitches: [JSON],
    targetProgress: Number,
    currentProgress: Number,
    isCompleted: {
        type: Boolean,
        default: false
    }, 
    dateSet: Date,
    dateCompleted: Date 
});

GoalSchema.methods.setCurrentProgress = function(progress) {
    this.currentProgress = Number.parseFloat(progress);
    this.isCompleted = (this.currentProgress >= this.targetProgress);
    if (this.isCompleted) {
        this.dateCompleted = new Date(Date.now());
    }
};

module.exports = mongoose.model('Goal', GoalSchema);