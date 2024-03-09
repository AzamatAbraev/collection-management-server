const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    tags: [String],
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
    },
    customValues: mongoose.Schema.Types.Mixed,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

itemSchema.index({ name: "text", tags: "text" });

module.exports = mongoose.model("Item", itemSchema);
