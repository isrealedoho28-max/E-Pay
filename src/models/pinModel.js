import mongoose from "mongoose";

const pinSchema= new mongoose.Schema(
  {
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true,
    },

    pin:{
      type:String,
      required:true,
    },
  }
)

const PinModel = mongoose.model("Pin", pinSchema);

export default PinModel;