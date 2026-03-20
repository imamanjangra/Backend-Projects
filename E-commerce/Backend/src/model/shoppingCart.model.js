import mongoose , {Schema} from "mongoose";

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  orderItems: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product"
      },
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],

  totalPrice: {
    type: Number,
    required: true
  },


}, { timestamps: true });

export const Order = mongoose.model('Order' , orderSchema)