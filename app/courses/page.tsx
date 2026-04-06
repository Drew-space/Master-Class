import PurchaseButton from "@/components/PurchaseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Show, SignInButton } from "@clerk/nextjs";
import { ConvexHttpClient } from "convex/browser";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async () => {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const courses = await convex.query(api.courses.getCourses);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl text-white font-bold mb-8">All Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {courses.map((course) => (
          <Card
            key={course._id}
            className="flex text-white flex-col  bg-violet-500/15 hover:text-white ring-violet-400/30 ring-1
                hover:bg-violet-500/25 hover:border-violet-400/50
                transition-all duration-150"
          >
            <Link href={`/courses/${course._id}`} className="cursor-pointer">
              <CardHeader>
                <Image
                  src={course.imageUrl}
                  alt={course.title}
                  width={640}
                  height={360}
                  loading="eager"
                  className="rounded-md object-cover"
                />
              </CardHeader>
              <CardContent className="grow">
                <CardTitle className="text-xl mb-2 hover:underline">
                  {course.title}
                </CardTitle>
              </CardContent>
            </Link>

            <CardFooter className="flex justify-between items-center">
              <Button
                variant="ghost"
                className="hover:bg-violet-500/25 hover:text-white ring-violet-400/30 ring-1  text-white text-lg px-3 py-1"
              >
                ${course.price.toFixed(2)}
              </Button>

              <Show when="signed-in">
                <PurchaseButton courseId={course._id} />
              </Show>
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <Button>Sign In to Enroll</Button>
                </SignInButton>
              </Show>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default page;
