import connectDB from "../../../lib/mongodb";
import { Blog } from "../../../models/Blog";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    const blogs = await Blog.find({}).populate("authorID");
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error("Error in signup route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
