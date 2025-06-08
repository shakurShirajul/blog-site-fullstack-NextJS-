import mongoose, { Document, Schema } from "mongoose";

export interface IBlog extends Document {
  title: string;
  tags: string[];
  content: string;
  upvotes: number;
  downvotes: number;
  author: mongoose.Types.ObjectId; // Reference to User
  comments: mongoose.Types.ObjectId[]; // Array of Comment IDs
}

const BlogSchema: Schema<IBlog> = new Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100, // Limit title length
    },
    tags: {
      type: [String],
      default: [],
      maxlength: 5, // Limit number of tags
    },
    content: {
      type: String,
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const Blog: mongoose.Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);
export default Blog;
