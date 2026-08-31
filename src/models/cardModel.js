import mongoose from "mongoose";

const cardSchema= new mongoose.Schema(
  {
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true,
    },

    name:{
      type:String,
      required:true,
    },

  amount:{
   type:Number,
   required:true,
    },

    status:{
      type:String,
      enum:["Completed", "Cancelled"],
      default:"Completed"
    },

    date:{
      type:Date,
      default:Date.now,
    },

  },
  {timestamps:true}
)

const CardModel = mongoose.model("CardActivity", cardSchema);

export default CardModel;