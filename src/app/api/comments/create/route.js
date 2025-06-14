import connectDB from "../../../../lib/mongodb";
import { Blog } from "../../../../models/Blog";
import { Comment } from "../../../../models/Comment";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { content, authorID, blogID } = await req.json();
    if (!content || !authorID || !blogID) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    await connectDB();
    const newComment = await Comment.create({
      content,
      authorID,
      blogID,
    });
    if (newComment) {
      const updateBlog = await Blog.updateOne(
        { _id: blogID },
        { $push: { comments: newComment._id } }
      );
    }
    return NextResponse.json(
      { message: "Comment created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in signup route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
