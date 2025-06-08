import mongoose, { Document, Schema, models, Model } from "mongoose";

export interface IComment extends Document {
  content: string;
  author: mongoose.Types.ObjectId; // Reference to User
  post: mongoose.Types.ObjectId; // Reference to Post
}

const CommentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const Comment: Model<IComment> =
  models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
export default Comment;
