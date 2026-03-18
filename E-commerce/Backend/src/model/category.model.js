import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    default: null
  }
});

export const Category = mongoose.model("Category", categorySchema);

