import connectDB from "../../../../lib/mongodb";
import { Comment } from "../../../../models/Comment";
import { Blog } from "../../../../models/Blog";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    await connectDB();
    console.log(id);
    const blogs = await Blog.findOne({ _id: id })
      .populate("authorID")
      .populate({
        path: "comments",
        populate: {
          path: "authorID",
          model: "User",
          select: "name and image",
        },
      });
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error("Error in signup route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
