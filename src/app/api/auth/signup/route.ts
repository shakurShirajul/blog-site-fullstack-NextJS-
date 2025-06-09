import { NextResponse } from "next/server";
import brcypt from "bcrypt";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { name, image, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    // console.log("Received data:", { name, image, email, password });
    await connectDB();
    const exitingUser = await User.findOne({ email });
    if (exitingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    const hashedPassword = await brcypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      image: image || "",
      password: hashedPassword,
    });
    // console.log("New user created:", newUser);
    return NextResponse.json(
      { message: "User created successfully" },
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
