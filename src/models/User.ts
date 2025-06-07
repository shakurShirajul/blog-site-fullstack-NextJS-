import mongoose, { Schema, Document, Model, models } from "mongoose";
export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId; // MongoDB ObjectId
  name: string;
  image?: string; // Optional field for user image
  email: string;
  password: string;
}
const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\S+@\S+$/i,
    },
    password: {
      type: String,
      required: true,
      // match:
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const User: Model<IUser> =
  models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
