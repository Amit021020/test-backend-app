const mongoose = require('mongoose')
mongoose.connect("mongodb://host.docker.internal:27017/testapp")
const userSchema = mongoose.Schema({
    username: String,
    name: String,
    email: String,
    age: Number,
    password: String,
    posts: 
        [{type: mongoose.Schema.Types.ObjectId, ref: "post"}]
})
module.exports = mongoose.model('user',userSchema)