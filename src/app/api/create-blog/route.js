import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { title, tags, content, authorID } = await req.json();

    if (!title || !tags || !content || !authorID) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    await connectDB();

    const newPost = await Blog.create({
      title,
      tags,
      content,
      authorID,
    });

    return NextResponse.json(
      { message: "Blog created successfully" },
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
