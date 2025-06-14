import connectDB from "../../../lib/mongodb";
import { Blog } from "../../../models/Blog";
import mongoose, { Types } from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userID, blogID, voteTypes } = await req.json();

    if (!userID || !blogID || !voteTypes) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const userObjectId = new Types.ObjectId(userID);

    const blog = await Blog.findById(blogID);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    let update = {};

    if (voteTypes === "upvotes") {
      if (blog.upvotes.some((id) => id.equals(userObjectId))) {
        // Already upvoted: remove upvote
        update = { $pull: { upvotes: userObjectId } };
      } else {
        // Remove downvote if exists, add upvote
        update = {
          $addToSet: { upvotes: userObjectId },
          $pull: { downvotes: userObjectId },
        };
      }
    } else if (voteTypes === "downvotes") {
      if (blog.downvotes.some((id) => id.equals(userObjectId))) {
        // Already downvoted: remove downvote
        update = { $pull: { downvotes: userObjectId } };
      } else {
        // Remove upvote if exists, add downvote
        update = {
          $addToSet: { downvotes: userObjectId },
          $pull: { upvotes: userObjectId },
        };
      }
    } else {
      return NextResponse.json({ error: "Invalid vote type" }, { status: 400 });
    }

    await Blog.updateOne({ _id: blogID }, update);

    const updatedBlog = await Blog.findById(blogID, {
      upvotes: 1,
      downvotes: 1,
    });

    return NextResponse.json(
      {
        message: "Vote updated successfully",
        upvotes: updatedBlog?.upvotes,
        downvotes: updatedBlog?.downvotes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
