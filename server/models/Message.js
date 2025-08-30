import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
   sender:{type:String , required:true },
   reciever:{type:String , required:true },
  text: {type:String},
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
