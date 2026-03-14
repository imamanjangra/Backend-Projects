import mongoose, { Schema } from "mongoose";

const addressModel = new Schema(
  {
    state: {
      type: String,
        required: true,
    },
    city: {
      type: String,
        required: true,
    },
    pincode: {
      type: String,
        required: true,
    },
    street: {
      type: String,
    },
    addressLine: {
      type: String,
        required: true,
    },
    landmark: {
      type: String,
        required: true,
    },
    addressType: {
      type: String,
      enum: ["Home", "Office", "Other"],
        required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export const Address = mongoose.model("Address", addressModel);
