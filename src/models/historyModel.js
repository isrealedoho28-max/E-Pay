import mongoose from "mongoose";

const historySchema= new mongoose.Schema({

  title:{
    type: String,
    required: true,
  },
  caption:{
    type: String,
     required: true
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
   ref: "User",
   required: true
  },

}, {timestamps: true});

const HistoryModel= mongoose.model('History', historySchema);

export default HistoryModel