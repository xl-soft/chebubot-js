const   mongoose = require('mongoose'),
        Schema = mongoose.Schema

let CockSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    lenght: { type: Number, default: 0 },
    next: { type: Number },
    location: { type: String, default: 'overworld'},
    chat: { type: String },
    record: { type: Number, default: 0 }
})

let Cock = mongoose.model('Cock', CockSchema);

module.exports = Cock

