import mongoose from "mongoose";
  
const clickSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "URL",
      required: true,
      index : true
    },
    browser: String,
    os: String,
    device: String,
    cpu : String
  },
  { timestamps: true }
);

clickSchema.index({
  urlId : 1 , createdAt: 1 
})


export const Click =  mongoose.model("Click", clickSchema);