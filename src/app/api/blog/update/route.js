import connectDB from "../../../../lib/mongodb";
import { Blog } from "../../../../models/Blog";
import { Comment } from "../../../../models/Comment";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export async function PATCH(req) {
  try {
    const { title, tags, content, blogID } = await req.json();

    if (!title || !tags || !content || !blogID) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    await connectDB();
    const updatedBlog = await Blog.updateOne(
      { _id: blogID },
      {
        $set: {
          title,
          tags,
          content,
        },
      }
    );
    if (!updatedBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Blog updated successfully", blog: updatedBlog },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in blog delete route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
