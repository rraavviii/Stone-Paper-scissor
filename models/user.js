const mongoose=require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/authapp')

const userScema=mongoose.Schema({
    username: String,
    contact: Number,
    age:Number,
    email: String,
    password:String,
})

module.exports=mongoose.model('user',userScema)