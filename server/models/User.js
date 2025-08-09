import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email:{type:String , required : true},
  status:{
    "type":String,
    "enum":["online","offline","invisible"],
    "default":"offline"
  }
});

export default mongoose.model('User', userSchema);
