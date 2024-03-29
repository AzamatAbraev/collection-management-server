const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    tags: { type: [String], required: true },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
    },
    photo: { type: String, required: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    customValues: { type: Map, of: mongoose.Schema.Types.Mixed },
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
