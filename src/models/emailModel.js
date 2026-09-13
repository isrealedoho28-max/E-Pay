import mongoose from "mongoose";

const verifySchema = new mongoose.Schema({
  email:{
    type:String,
    required:true,
    },

    code:{
      type:String,
      required:true,
    },

    expiresAt:{
      type:Date,
      required:true
    }
})

const EmailModel = mongoose.model("Verify", verifySchema)

export default EmailModel;