import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String },
  password: { type: String, required: true },
  email:{type:String , required : true},
  status:{
    "type":String,
    "enum":["online","invisible"],
    "default":"invisible"
  }
});

export default mongoose.model('User', userSchema);
