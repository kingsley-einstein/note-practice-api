const Schema = require('mongoose').Schema;

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

GoalSchema.methods.setCurrentProgress = (progress) => {
    this.currentProgress = progress;
    this.isCompleted = (this.currentProgress >= this.targetProgress);
};

module.exports = require('mongoose').model('Goal', GoalSchema);