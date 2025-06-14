import connectDB from "@/lib/mongodb";
import { Blog } from "@/models/Blog";
import { Comment } from "@/models/Comment";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export async function DELETE(req) {
  try {
    const { blogID, userID } = await req.json();

    if (!blogID || !userID) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Delete the blog
    const deleteBlogResponse = await Blog.deleteOne({
      _id: blogID,
      authorID: userID,
    });
    if (deleteBlogResponse.deletedCount === 0) {
      return NextResponse.json(
        { error: "Blog not found or not authorized" },
        { status: 404 }
      );
    }

    // Delete comments related to this blog
    await Comment.deleteMany({ blogID: new Types.ObjectId(blogID) });

    return NextResponse.json(
      { message: "Blog and related comments deleted successfully" },
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
