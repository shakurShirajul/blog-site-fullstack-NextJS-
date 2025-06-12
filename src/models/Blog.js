import mongoose from "mongoose";
const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (value) => value.length <= 5,
        message: "You can only provide up to 5 tags.",
      },
    },
    content: {
      type: String,
      required: true,
    },
    upvotes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    downvotes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    authorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Comment",
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
