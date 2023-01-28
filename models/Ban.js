const   mongoose = require('mongoose'),
        Schema = mongoose.Schema

let BanSchema = new Schema({
    id: { type: String },
    reason: { type: String }
})

let Ban = mongoose.model('Ban', BanSchema);

module.exports = Ban

