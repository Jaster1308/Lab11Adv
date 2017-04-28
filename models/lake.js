var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// Defines schema for a Lake object.
var lakeSchema = new mongoose.Schema({
    lakeName: { type: String, required: true, unique: true, uniqueCaseInsensitive: true },
    runTimes: [ { type: Number, required: true, min: 1 } ],
    runDate: { type: Date }
});

// Sets the schema for Lake objects and adds a plugin.
var Lake = mongoose.model('Lake', lakeSchema);
lakeSchema.plugin(uniqueValidator);

module.exports = Lake;