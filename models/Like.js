const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

likeSchema.index({ itemId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Like", likeSchema);
