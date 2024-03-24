const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: String,
    itemCount: Number,
    customFields: [
      {
        fieldType: { type: String, required: true },
        fieldName: { type: String, required: true },
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

collectionSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Collection", collectionSchema);
