"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignupMutation } from "@/redux/api/baseApi";
import { Image, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { redirect } from "next/navigation";

type Inputs = {
  name: string;
  image?: string; // Optional field for user image
  email: string;
  password: string;
};

const Signin = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const [signupUser, { isLoading, error }] = useSignupMutation();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      // console.log("Form data submitted:", data);
      const response = await signupUser(data).unwrap();
      if (response) {
        reset();
        redirect("/auth/signin");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome Back!
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label>Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="e.g. John Doe"
                  type="text"
                  className="pl-10"
                  {...register("name", { required: "Name is required" })}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              <div className="relative">
                <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  className="pl-10"
                  {...register("image")}
                />
              </div>
              {/* {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )} */}
            </div>
            {/* Email */}
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="me@example.com"
                  className="pl-10"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email format",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Password</Label>
                <Link href="/" className="text-sm text-primary hover:underline">
                  Forget Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="**********************"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    validate: (value) => {
                      if (!/[A-Z]/.test(value))
                        return "Password must include an uppercase letter";
                      if (!/[a-z]/.test(value))
                        return "Password must include a lowercase letter";
                      if (!/\d/.test(value))
                        return "Password must include a number";
                      if (!/[@$!%*?&]/.test(value))
                        return "Password must include a special character";
                      if (value.length < 8)
                        return "Password must be at least 8 characters";
                      return true;
                    },
                  })}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            {/* Button */}
            <div className="space-y-2">
              <Button className="w-full">Sign in</Button>
              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  Don't have an account?
                </span>
                <Link href="/signup"> Sign up</Link>
              </div>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};
export default Signin;
