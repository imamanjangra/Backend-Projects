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

 shippingAddress: {
        state: String,
        city: String,
        pincode: Number,
        street: String,
        addressLine: String,
        landmark: String,
        addressType:String,
      },

  paymentMethod: {
    type: String,
    default : "COD",
  },

  totalPrice: {
    type: Number,
    required: true
  },

  isPaid: {
    type: Boolean,
    default: false
  },

  isDelivered: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export const FinalCart = mongoose.model('FinalCart' , orderSchema)