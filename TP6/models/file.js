var mongoose = require('mongoose')

var fileSchema = new mongoose.Schema({
    name: String,
    desc: String,
    date: String,
    mimetype: String,
    size: Number 
})

module.exports = mongoose.model('file',fileSchema)
