import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {

    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    brand: {
      type: String
    },

    brandLink: {
      type: String
    },

    price: {
      type: Number,
      required: true
    },

    discountPrice: {
      type: Number
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    stock: {
      type: Number,
      required: true,
      default: 0
    },

    soldCount: {
      type: Number,
      default: 0
    },

    coverImage: {
      type: String,
      required: true
    },

    images: [
      {
        url: {
          type: String
        },
        public_id: {
          type: String
        }
      }
    ],

    ratings: {
      type: Number,
      default: 0
    },

    numReviews: {
      type: Number,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true
    },

  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);