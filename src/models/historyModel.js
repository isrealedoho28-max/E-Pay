import mongoose from "mongoose";

const historySchema= new mongoose.Schema({
user:{
    type: mongoose.Schema.Types.ObjectId,
   ref: "User",
   required: true
  },
  receiver:{
    type: String,
    required: true,
  },
  bankName:{
    type: String,
     required: true
  },
  amount:{
  type:Number,
  required:true
  },
  status:{
    type:String,
    default:"..pending"
  },
  date:{
    type:Date,
    default:Date.now
  }
,

}, {timestamps: true});

const HistoryModel= mongoose.model('History', historySchema);

export default HistoryModel